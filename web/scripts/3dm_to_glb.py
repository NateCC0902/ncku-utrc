"""Convert the Rhino USV model to a web-sized GLB.

Rhino caches a render mesh (with crease-correct vertex normals) on every Brep
face, so we harvest those instead of tessellating NURBS ourselves. Parts are
merged per material to keep the draw-call count low.

    python scripts/3dm_to_glb.py <in.3dm> <out.glb> [--drop 0,1,2,...]
"""

import sys
import numpy as np
import rhino3dm as r
import trimesh


def object_material(obj, doc):
    """(rgb, reflectivity) -- per-object material first, then display colour.

    Most parts carry MaterialFromObject with the real paint colour while their
    display ColorSource is ByLayer on a black layer, so DrawColor alone would
    flatten the whole hull to black.
    """
    a = obj.Attributes
    if a.MaterialSource == r.ObjectMaterialSource.MaterialFromObject:
        mi = a.MaterialIndex
        if 0 <= mi < len(doc.Materials):
            m = doc.Materials[mi]
            return tuple(int(x) for x in m.DiffuseColor[:3]), float(m.Reflectivity)
    return tuple(int(x) for x in a.DrawColor(doc)[:3]), 0.0


def mesh_arrays(m, xform=None):
    """rhino3dm Mesh -> (verts, normals, tris). Quads split into two triangles."""
    v = np.array([[p.X, p.Y, p.Z] for p in m.Vertices], dtype=np.float64)
    n = np.array([[p.X, p.Y, p.Z] for p in m.Normals], dtype=np.float64)
    if len(n) != len(v):
        n = np.zeros_like(v)
    if xform is not None:
        rot = xform[:3, :3]
        v = v @ rot.T + xform[:3, 3]
        n = n @ np.linalg.inv(rot).T  # normal matrix
    tris = []
    for i in range(len(m.Faces)):
        f = m.Faces[i]
        tris.append(f[:3])
        if len(f) == 4 and f[2] != f[3]:
            tris.append((f[0], f[2], f[3]))
    return v, n, np.array(tris, dtype=np.int64)


def main_cluster(doc, gap_frac=0.12):
    """Indices of the objects that make up the vehicle itself.

    The file ships parts parked away from the hull -- a ground plane ~10 m below
    it and a spare mast assembly ~2.5 m astern -- which would otherwise dominate
    the bounding box and squash the vehicle in frame. Those strays sit across an
    empty gap on some axis, so on each axis we split the objects wherever the
    sorted centroids leave a gap wider than `gap_frac` of the span, and keep the
    most populated group. Repeat until no axis splits anything off.
    """
    cen = []
    for o in doc.Objects:
        b = o.Geometry.GetBoundingBox()
        cen.append([(b.Min.X + b.Max.X) / 2,
                    (b.Min.Y + b.Max.Y) / 2,
                    (b.Min.Z + b.Max.Z) / 2])
    cen = np.array(cen)
    keep = np.arange(len(cen))

    changed = True
    while changed and len(keep) > 1:
        changed = False
        for axis in range(3):
            v = cen[keep, axis]
            order = np.argsort(v)
            sv = v[order]
            span = sv[-1] - sv[0]
            if span <= 0:
                continue
            # Cut points are the gaps wide enough to mean "somewhere else".
            cuts = np.flatnonzero(np.diff(sv) > gap_frac * span)
            if not len(cuts):
                continue
            groups = np.split(order, cuts + 1)
            biggest = max(groups, key=len)
            if len(biggest) < len(keep):
                keep = keep[biggest]
                changed = True
    return set(int(i) for i in keep)


def collect(obj, doc, out, xform=None):
    key = object_material(obj, doc)
    kind = type(obj.Geometry).__name__
    g = obj.Geometry
    if kind == "Brep":
        for i in range(len(g.Faces)):
            m = g.Faces[i].GetMesh(r.MeshType.Any)
            if m and len(m.Faces):
                out.setdefault(key, []).append(mesh_arrays(m, xform))
    elif kind == "Mesh":
        if len(g.Faces):
            out.setdefault(key, []).append(mesh_arrays(g, xform))
    elif kind == "InstanceReference":
        idef = doc.InstanceDefinitions.FindId(g.ParentIdefId)
        if idef is None:
            return
        t = g.Xform
        x = np.array([[t.M00, t.M01, t.M02, t.M03],
                      [t.M10, t.M11, t.M12, t.M13],
                      [t.M20, t.M21, t.M22, t.M23],
                      [t.M30, t.M31, t.M32, t.M33]], dtype=np.float64)
        x = x if xform is None else xform @ x
        for oid in idef.GetObjectIds():
            child = doc.Objects.FindId(oid)
            if child:
                collect(child, doc, out, x)


# Leftover flat plates modelled at the bow, hanging below the hull with no
# material assigned. They sit too close to the hull for the gap filter to
# separate, so they are named outright. Re-check these if the .3dm is re-exported.
DETACHED_BOW_PLATES = (0, 1, 2, 3, 4, 5)


def main():
    src, dst = sys.argv[1], sys.argv[2]
    drop = set(DETACHED_BOW_PLATES)
    if "--drop" in sys.argv:
        drop = {int(x) for x in sys.argv[sys.argv.index("--drop") + 1].split(",") if x}
    doc = r.File3dm.Read(src)

    keep = main_cluster(doc) - drop
    buckets = {}
    for i, o in enumerate(doc.Objects):
        if i in keep:
            collect(o, doc, buckets)
    print(f"kept {len(keep)}/{len(doc.Objects)} objects (dropped strays outside the hull cluster)")

    scene = trimesh.Scene()
    for (col, refl), parts in buckets.items():
        verts, norms, faces, off = [], [], [], 0
        for v, n, f in parts:
            verts.append(v)
            norms.append(n)
            faces.append(f + off)
            off += len(v)
        # process=False keeps Rhino's vertex split, so crease normals survive.
        mesh = trimesh.Trimesh(np.vstack(verts), np.vstack(faces),
                               vertex_normals=np.vstack(norms), process=False)
        mesh.visual = trimesh.visual.TextureVisuals(
            material=trimesh.visual.material.PBRMaterial(
                name=f"m_{col[0]:02x}{col[1]:02x}{col[2]:02x}",
                baseColorFactor=[c / 255 for c in col] + [1.0],
                metallicFactor=round(min(refl, 0.9), 3),
                roughnessFactor=round(max(1.0 - 0.7 * refl, 0.15), 3),
            )
        )
        scene.add_geometry(mesh, node_name=f"c{col[0]:02x}{col[1]:02x}{col[2]:02x}")

    # Rhino is Z-up; glTF is Y-up. Rotate, then centre and normalise to a
    # 1-unit bounding box so camera framing is independent of document units.
    zup = trimesh.transformations.rotation_matrix(-np.pi / 2, [1, 0, 0])
    scene.apply_transform(zup)
    lo, hi = scene.bounds
    scale = 1.0 / np.max(hi - lo)
    xf = np.eye(4) * scale
    xf[3, 3] = 1.0
    xf[:3, 3] = -((lo + hi) / 2) * scale
    scene.apply_transform(xf)

    scene.export(dst)
    tri = sum(len(g.faces) for g in scene.geometry.values())
    print(f"{len(scene.geometry)} materials, {tri} triangles -> {dst}")


if __name__ == "__main__":
    main()
