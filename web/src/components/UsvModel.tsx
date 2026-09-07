"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const MODEL_URL = "/models/usv.glb";
// Self-hosted so the viewer does not depend on Google's CDN at runtime.
const DRACO_PATH = "/draco/";

/**
 * The vessel, rendered live and turned by an external angle source.
 *
 * `yawRef`/`pitchRef` are read every frame rather than passed as props: the
 * caller drives them straight from scroll, and routing 60 fps of angle changes
 * through React state would re-render the whole section on every wheel tick.
 * The loop damps toward whatever it finds there, which also smooths the coarse
 * steps a trackpad or a low-resolution wheel produces.
 */
/** A point on the hull that a marker in the overlay is pinned to. */
export interface Anchor {
  id: string;
  /** Model-space position, in the GLB's own units (a 1-unit bounding box). */
  position: [number, number, number];
  /** Outward direction, used to hide the marker once the point turns away. */
  normal: [number, number, number];
}

export function UsvModel({
  yawRef,
  pitchRef,
  dollyRef,
  anchors,
  renderMarker,
  onReady,
  className = "",
}: {
  yawRef: React.RefObject<number>;
  pitchRef: React.RefObject<number>;
  /** Camera distance as a fraction of the fitted distance; 1 = fully framed. */
  dollyRef?: React.RefObject<number>;
  anchors?: readonly Anchor[];
  /**
   * Content for the marker pinned to each anchor. The wrapper is rendered and
   * positioned here rather than by the caller: the render loop and the marker
   * nodes then share one component's lifecycle, so the nodes are guaranteed to
   * exist by the time the loop looks for them. They are moved by writing
   * transforms straight onto the nodes — putting projected screen coordinates
   * into React state would re-render the overlay 60 times a second for what is
   * ultimately a CSS transform.
   */
  renderMarker?: (anchor: Anchor) => React.ReactNode;
  onReady?: () => void;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const markerEls = useRef(new Map<string, HTMLElement>());
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setFailed(true); // No WebGL — the caller's still image stands in.
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    host.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);

    // A procedural room gives the hull's gloss and the metal fittings something
    // to reflect. Generated in-process, so it costs no extra network asset.
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    // Key light from the upper front-left, matching the page's implied light.
    const key = new THREE.DirectionalLight(0xfffaf0, 2.1);
    key.position.set(-3, 5, 4);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xd8e4f0, 0.7);
    fill.position.set(4, 2, -3);
    scene.add(fill);
    scene.add(new THREE.HemisphereLight(0xf4f1e8, 0x8b95a0, 0.5));

    // The model is authored around the origin with a 1-unit bounding box, so
    // the pivot only needs re-centring on Y to spin about the hull's midline.
    const pivot = new THREE.Group();
    scene.add(pivot);

    let frame = 0;
    let disposed = false;
    // Seed the damper at its target and apply it straight away: with no scroll
    // yet the loop's delta is zero, so a pivot left at 0 would never catch up
    // and the vessel would sit bow-on instead of at its opening heading.
    let yaw = yawRef.current ?? 0;
    let pitch = pitchRef.current ?? 0;
    let dolly = dollyRef?.current ?? 1;
    pivot.rotation.set(pitch, yaw, 0);

    const draco = new DRACOLoader().setDecoderPath(DRACO_PATH);
    const loader = new GLTFLoader().setDRACOLoader(draco);

    // Radius of the sphere the camera has to frame. Set once the model lands;
    // until then the fallback still image is what the reader is looking at.
    let radius = 0.6;

    loader.load(
      MODEL_URL,
      (gltf) => {
        if (disposed) return;
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        model.position.sub(box.getCenter(new THREE.Vector3()));
        // Framed on the sphere, not the box, so the hull stays the same size in
        // frame all the way round instead of swelling as it turns broadside.
        radius = box.getSize(new THREE.Vector3()).length() / 2;
        pivot.add(model);
        onReady?.();
        resize();
      },
      undefined,
      () => setFailed(true),
    );

    // Looking slightly down from the bow quarter — the angle the vessel is
    // usually drawn from in the centre's own plates.
    const VIEW_DIR = new THREE.Vector3(0, 0.36, 1).normalize();

    let dirty = true;
    let fitted = 3; // distance at which the whole vessel is in frame

    function resize() {
      const { clientWidth: w, clientHeight: h } = host!;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;

      // Fit the bounding sphere to whichever of the two fields of view is
      // tighter, so a tall narrow box pulls back instead of cropping the bow.
      const vFov = camera.fov * (Math.PI / 180);
      const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
      fitted = (radius / Math.sin(Math.min(vFov, hFov) / 2)) * 1.06;

      camera.updateProjectionMatrix();
      place();
    }

    function place() {
      camera.position.copy(VIEW_DIR).multiplyScalar(fitted * dolly);
      camera.lookAt(0, 0, 0);
      dirty = true;
    }

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();

    // Scratch vectors, reused every frame so projection allocates nothing.
    const worldPos = new THREE.Vector3();
    const worldNormal = new THREE.Vector3();
    const toCamera = new THREE.Vector3();

    function placeMarkers() {
      const els = markerEls.current;
      if (!anchors?.length) return;
      const { clientWidth: w, clientHeight: h } = host!;

      for (const a of anchors) {
        const el = els.get(a.id);
        if (!el) continue;

        worldPos.set(...a.position).applyEuler(pivot.rotation);
        worldNormal.set(...a.normal).applyEuler(pivot.rotation).normalize();
        toCamera.subVectors(camera.position, worldPos).normalize();

        // Facing the reader, and not yet edge-on. Below the threshold the
        // marker would sit on top of hull it is behind, so it is faded out
        // and made unclickable rather than left to mislead.
        const facing = worldNormal.dot(toCamera);
        const visible = facing > 0.12;

        const ndc = worldPos.clone().project(camera);
        el.style.transform = `translate3d(${((ndc.x + 1) / 2) * w}px, ${
          ((1 - ndc.y) / 2) * h
        }px, 0)`;
        el.style.opacity = visible ? "1" : "0";
        el.style.pointerEvents = visible ? "auto" : "none";
        el.dataset.facing = visible ? "true" : "false";
        // Which way an expanded card should open, so it never runs off the
        // stage: away from whichever edge the marker is nearer.
        el.dataset.side = ndc.x > 0.15 ? "left" : "right";
      }
    }

    function tick() {
      frame = requestAnimationFrame(tick);
      // Damped follow: fast enough to feel attached to the wheel, slow enough
      // to absorb the coarse steps a trackpad or low-resolution wheel sends.
      const dy = (yawRef.current ?? 0) - yaw;
      const dp = (pitchRef.current ?? 0) - pitch;
      const dd = (dollyRef?.current ?? 1) - dolly;
      if (Math.abs(dy) > 1e-4 || Math.abs(dp) > 1e-4) {
        yaw += dy * 0.12;
        pitch += dp * 0.12;
        pivot.rotation.y = yaw;
        pivot.rotation.x = pitch;
        dirty = true;
      }
      if (Math.abs(dd) > 1e-4) {
        dolly += dd * 0.12;
        place();
      }
      // Idle scroll positions cost nothing: once the vessel has settled the
      // canvas stops redrawing until the angle moves again.
      if (dirty) {
        renderer.render(scene, camera);
        dirty = false;
      }
      // Unconditional, unlike the render: the markers are mounted by the
      // caller only once loading finishes, which is after the first frame has
      // already drawn and cleared `dirty`. Gating this too would leave them
      // parked at opacity 0 until something else happened to move the hull.
      // Four anchors of vector maths per frame is not worth a dirty flag.
      placeMarkers();
    }
    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      draco.dispose();
      pmrem.dispose();
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          const m = o.material;
          (Array.isArray(m) ? m : [m]).forEach((x) => x?.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [yawRef, pitchRef, dollyRef, anchors, onReady]);

  if (failed) return null;
  return (
    <div className={`relative ${className}`}>
      <div ref={hostRef} className="absolute inset-0" aria-hidden />
      {renderMarker &&
        anchors?.map((a) => (
          <div
            key={a.id}
            ref={(el) => {
              if (el) markerEls.current.set(a.id, el);
              else markerEls.current.delete(a.id);
            }}
            // Positioned entirely by the render loop; starts hidden so it
            // never flashes at the origin before the first projection.
            className="group absolute left-0 top-0 z-10 transition-opacity duration-300"
            style={{ opacity: 0 }}
          >
            {renderMarker(a)}
          </div>
        ))}
    </div>
  );
}
