"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

interface AvatarProps { stressLevel: number; name: string; }

export default function Avatar3D({ stressLevel, name }: AvatarProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const w = mount.clientWidth, h = mount.clientHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.set(0, 0, 5);

    // Ambient + directional light
    scene.add(new THREE.AmbientLight(0x112240, 2));
    const dir = new THREE.DirectionalLight(0x00d4ff, 3);
    dir.position.set(2, 3, 2);
    scene.add(dir);
    const dir2 = new THREE.DirectionalLight(0x7c3aed, 2);
    dir2.position.set(-2, -1, 1);
    scene.add(dir2);

    // Avatar body parts
    const color = stressLevel > 70 ? 0xef4444 : stressLevel > 40 ? 0xf59e0b : 0x00d4ff;

    // Head
    const headGeo = new THREE.SphereGeometry(0.6, 32, 32);
    const headMat = new THREE.MeshPhongMaterial({ color, emissive: color, emissiveIntensity: 0.2, shininess: 80 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.4;
    scene.add(head);

    // Body
    const bodyGeo = new THREE.CylinderGeometry(0.4, 0.5, 1.2, 32);
    const bodyMat = new THREE.MeshPhongMaterial({ color: 0x112240, emissive: 0x00d4ff, emissiveIntensity: 0.1, shininess: 60 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.2;
    scene.add(body);

    // Arms
    const armGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.9, 16);
    const armMat = new THREE.MeshPhongMaterial({ color: 0x112240, emissive: 0x00d4ff, emissiveIntensity: 0.1 });
    const leftArm = new THREE.Mesh(armGeo, armMat);
    leftArm.position.set(-0.65, 0.3, 0); leftArm.rotation.z = 0.3;
    scene.add(leftArm);
    const rightArm = new THREE.Mesh(armGeo, armMat);
    rightArm.position.set(0.65, 0.3, 0); rightArm.rotation.z = -0.3;
    scene.add(rightArm);

    // Orbit ring
    const ringGeo = new THREE.TorusGeometry(1.2, 0.03, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.4 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);

    // Floating particles around avatar
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(60);
    for (let i = 0; i < 60; i += 3) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.5 + Math.random() * 0.5;
      positions[i] = Math.cos(angle) * radius;
      positions[i + 1] = (Math.random() - 0.5) * 3;
      positions[i + 2] = Math.sin(angle) * radius;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0x00d4ff, size: 0.05, transparent: true, opacity: 0.8 });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    let raf: number;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      head.rotation.y += 0.005;
      ring.rotation.z += 0.008;
      particles.rotation.y += 0.003;
      head.position.y = 1.4 + Math.sin(Date.now() * 0.001) * 0.05;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [stressLevel]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
      <div style={{
        position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)",
        textAlign: "center", pointerEvents: "none"
      }}>
        <div style={{ fontSize: 14, color: "#00d4ff", fontWeight: 600 }}>{name}</div>
        <div style={{ fontSize: 11, color: "#64748b" }}>Digital Twin</div>
      </div>
    </div>
  );
}
