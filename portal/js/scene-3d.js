/* ============================================================
   SCENE-3D — mini globe with ship marker
   Three.js wireframe globe rotating, shows current location
   ============================================================ */

window.SceneCar = (function() {

  function initGlobe() {
    const canvas = document.getElementById('globeCanvas');
    if (!canvas || typeof THREE === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Simple static gradient fallback
      const ctx = canvas.getContext('2d');
      canvas.width = 280; canvas.height = 280;
      const g = ctx.createRadialGradient(140, 140, 30, 140, 140, 130);
      g.addColorStop(0, '#4A8BFF'); g.addColorStop(1, '#050B1A');
      ctx.fillStyle = g; ctx.fillRect(0, 0, 280, 280);
      return;
    }

    const w = canvas.parentElement.clientWidth;
    const h = canvas.parentElement.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(w, h, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Globe — wireframe sphere
    const geom = new THREE.SphereGeometry(1.3, 32, 24);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x4A8BFF,
      wireframe: true,
      transparent: true,
      opacity: 0.5
    });
    const sphere = new THREE.Mesh(geom, mat);
    scene.add(sphere);

    // Inner glow sphere
    const inner = new THREE.Mesh(
      new THREE.SphereGeometry(1.25, 32, 24),
      new THREE.MeshBasicMaterial({ color: 0x0A1530, transparent: true, opacity: 0.6 })
    );
    scene.add(inner);

    // Atmosphere glow
    const atmoGeom = new THREE.SphereGeometry(1.55, 32, 24);
    const atmoMat = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.6 - dot(vNormal, vec3(0,0,1)), 2.0);
          gl_FragColor = vec4(0.29, 0.55, 1.0, 1.0) * intensity;
        }`,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
    const atmo = new THREE.Mesh(atmoGeom, atmoMat);
    scene.add(atmo);

    // Marker at current ship position (35.18°N, -12.45°W)
    // Convert lat/lon to 3D position on sphere of radius 1.3
    function latLngTo3D(lat, lng, r = 1.32) {
      const phi = (90 - lat) * Math.PI / 180;
      const theta = (lng + 180) * Math.PI / 180;
      return new THREE.Vector3(
        -r * Math.sin(phi) * Math.cos(theta),
         r * Math.cos(phi),
         r * Math.sin(phi) * Math.sin(theta)
      );
    }

    const shipPos = latLngTo3D(35.18, -12.45);
    const startPos = latLngTo3D(33.7, -84.4); // Atlanta
    const endPos   = latLngTo3D(32.0, 34.9);  // Lod, Israel

    // Ship marker — pulsing sphere
    const markerMat = new THREE.MeshBasicMaterial({ color: 0x6BA5FF });
    const marker = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 16), markerMat);
    marker.position.copy(shipPos);
    scene.add(marker);

    // Start and end markers
    const startMarker = new THREE.Mesh(
      new THREE.SphereGeometry(0.03, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0x3DDC97 })
    );
    startMarker.position.copy(startPos);
    scene.add(startMarker);

    const endMarker = new THREE.Mesh(
      new THREE.SphereGeometry(0.03, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xE8B341 })
    );
    endMarker.position.copy(endPos);
    scene.add(endMarker);

    // Route arc (from Atlanta to ship)
    const arcPoints = [];
    const steps = 40;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const p = new THREE.Vector3().lerpVectors(startPos, shipPos, t);
      p.normalize().multiplyScalar(1.32 + Math.sin(t * Math.PI) * 0.15);
      arcPoints.push(p);
    }
    const arcGeom = new THREE.BufferGeometry().setFromPoints(arcPoints);
    const arc = new THREE.Line(arcGeom, new THREE.LineBasicMaterial({ color: 0x4A8BFF, transparent: true, opacity: 0.8 }));
    scene.add(arc);

    // Future route — dashed
    const futurePoints = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const p = new THREE.Vector3().lerpVectors(shipPos, endPos, t);
      p.normalize().multiplyScalar(1.32 + Math.sin(t * Math.PI) * 0.15);
      futurePoints.push(p);
    }
    const futureGeom = new THREE.BufferGeometry().setFromPoints(futurePoints);
    const future = new THREE.Line(futureGeom, new THREE.LineDashedMaterial({
      color: 0x4A8BFF, dashSize: 0.05, gapSize: 0.04, transparent: true, opacity: 0.4
    }));
    future.computeLineDistances();
    scene.add(future);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));

    // Tilt globe so ship is roughly facing camera initially
    sphere.rotation.x = 0.3;
    inner.rotation.x = 0.3;
    atmo.rotation.x = 0.3;

    const group = new THREE.Group();
    scene.remove(sphere); scene.remove(inner); scene.remove(atmo);
    scene.remove(marker); scene.remove(startMarker); scene.remove(endMarker);
    scene.remove(arc); scene.remove(future);
    group.add(sphere); group.add(inner); group.add(atmo);
    group.add(marker); group.add(startMarker); group.add(endMarker);
    group.add(arc); group.add(future);
    group.rotation.x = 0.3;
    scene.add(group);

    // Animate
    let t = 0;
    function animate() {
      t += 0.005;
      group.rotation.y += 0.003;

      // Pulse ship marker
      const s = 1 + Math.sin(t * 4) * 0.3;
      marker.scale.set(s, s, s);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();

    // Resize
    new ResizeObserver(() => {
      const w2 = canvas.parentElement.clientWidth;
      const h2 = canvas.parentElement.clientHeight;
      renderer.setSize(w2, h2, false);
      camera.aspect = w2 / h2;
      camera.updateProjectionMatrix();
    }).observe(canvas.parentElement);
  }

  return { initGlobe };
})();
