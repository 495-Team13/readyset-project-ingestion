import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "./GLTFLoader.js";

function ModelViewer(props) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const loader = new GLTFLoader();
    loader.load(props.modelPath, (gltf) => {
      scene.add(gltf.scene);
    });

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      mount.removeChild(renderer.domElement);
    };
  }, [props.modelPath]);

  return <div ref={mountRef} />;
}

export default ModelViewer;
