(function () {
    'use strict';

    const pointCount = 46;
    const connectionDistance = 1.12;
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    let renderer;
    let scene;
    let camera;
    let network;
    let points;
    let lines;
    let pointMaterial;
    let lineMaterial;
    let rafId;
    let isVisible = true;
    let isRunning = false;
    let pointerX = 0;
    let pointerY = 0;
    let lastFrame = 0;

    function buildNetwork(container) {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(40, 1, 0.1, 20);
        camera.position.z = 5.6;

        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        network = new THREE.Group();
        scene.add(network);

        const positions = new Float32Array(pointCount * 3);
        const velocities = [];
        for (let index = 0; index < pointCount; index += 1) {
            const offset = index * 3;
            const radius = 1.35 + Math.random() * 1.25;
            const angle = Math.random() * Math.PI * 2;
            positions[offset] = Math.cos(angle) * radius;
            positions[offset + 1] = Math.sin(angle) * radius;
            positions[offset + 2] = (Math.random() - 0.5) * 1.4;
            velocities.push({
                x: (Math.random() - 0.5) * 0.002,
                y: (Math.random() - 0.5) * 0.002,
                z: (Math.random() - 0.5) * 0.001
            });
        }

        const pointGeometry = new THREE.BufferGeometry();
        pointGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        pointMaterial = new THREE.PointsMaterial({
            color: 0x00ffcc,
            size: 0.052,
            transparent: true,
            opacity: 0.95,
            sizeAttenuation: true
        });
        points = new THREE.Points(pointGeometry, pointMaterial);
        points.userData.velocities = velocities;
        network.add(points);

        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pointCount * pointCount * 3), 3));
        lineGeometry.setDrawRange(0, 0);
        lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.18 });
        lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        network.add(lines);

        updateTheme();
        resize(container);
        updateConnections();
        render();
    }

    function updateConnections() {
        const pointPositions = points.geometry.attributes.position;
        const linePositions = lines.geometry.attributes.position.array;
        let lineVertex = 0;

        for (let first = 0; first < pointCount; first += 1) {
            for (let second = first + 1; second < pointCount; second += 1) {
                const dx = pointPositions.getX(first) - pointPositions.getX(second);
                const dy = pointPositions.getY(first) - pointPositions.getY(second);
                const dz = pointPositions.getZ(first) - pointPositions.getZ(second);
                if ((dx * dx) + (dy * dy) + (dz * dz) > connectionDistance * connectionDistance) continue;

                linePositions[lineVertex++] = pointPositions.getX(first);
                linePositions[lineVertex++] = pointPositions.getY(first);
                linePositions[lineVertex++] = pointPositions.getZ(first);
                linePositions[lineVertex++] = pointPositions.getX(second);
                linePositions[lineVertex++] = pointPositions.getY(second);
                linePositions[lineVertex++] = pointPositions.getZ(second);
            }
        }

        lines.geometry.attributes.position.needsUpdate = true;
        lines.geometry.setDrawRange(0, lineVertex / 3);
    }

    function updatePoints() {
        const positions = points.geometry.attributes.position;
        const velocities = points.userData.velocities;
        for (let index = 0; index < pointCount; index += 1) {
            const x = positions.getX(index) + velocities[index].x;
            const y = positions.getY(index) + velocities[index].y;
            const z = positions.getZ(index) + velocities[index].z;
            if (Math.abs(x) > 2.55) velocities[index].x *= -1;
            if (Math.abs(y) > 2.55) velocities[index].y *= -1;
            if (Math.abs(z) > 0.85) velocities[index].z *= -1;
            positions.setXYZ(index, x, y, z);
        }
        positions.needsUpdate = true;
        updateConnections();
    }

    function updateTheme() {
        const isLightTheme = document.body.classList.contains('light-theme');
        const color = isLightTheme ? 0x007f6b : 0x00ffcc;
        pointMaterial.color.setHex(color);
        pointMaterial.opacity = isLightTheme ? 0.82 : 0.95;
        lineMaterial.color.setHex(color);
        lineMaterial.opacity = isLightTheme ? 0.16 : 0.18;
    }

    function resize(container) {
        const { width, height } = container.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }

    function render() {
        renderer.render(scene, camera);
    }

    function shouldReduceMotion() {
        return document.body.classList.contains('reduce-motion') || reducedMotionQuery.matches;
    }

    function animate(timestamp) {
        if (!isRunning) return;
        rafId = window.requestAnimationFrame(animate);
        if (timestamp - lastFrame < 32) return;
        lastFrame = timestamp;
        updatePoints();
        network.rotation.y += (pointerX * 0.15 - network.rotation.y) * 0.025;
        network.rotation.x += (-pointerY * 0.1 - network.rotation.x) * 0.025;
        render();
    }

    function start() {
        if (isRunning || !isVisible || shouldReduceMotion()) return;
        isRunning = true;
        rafId = window.requestAnimationFrame(animate);
    }

    function stop() {
        isRunning = false;
        window.cancelAnimationFrame(rafId);
        render();
    }

    function init() {
        const container = document.getElementById('hero-data-network');
        if (!container || typeof THREE === 'undefined') return;

        buildNetwork(container);
        window.addEventListener('resize', () => resize(container), { passive: true });
        window.addEventListener('pointermove', (event) => {
            pointerX = (event.clientX / window.innerWidth) * 2 - 1;
            pointerY = (event.clientY / window.innerHeight) * 2 - 1;
        }, { passive: true });

        new MutationObserver(() => {
            updateTheme();
            if (shouldReduceMotion()) stop();
            else start();
        }).observe(document.body, { attributes: true, attributeFilter: ['class'] });

        if ('IntersectionObserver' in window) {
            new IntersectionObserver(([entry]) => {
                isVisible = entry.isIntersecting;
                if (isVisible) start();
                else stop();
            }, { threshold: 0.05 }).observe(container);
        }

        reducedMotionQuery.addEventListener?.('change', () => {
            if (shouldReduceMotion()) stop();
            else start();
        });
        start();
    }

    window.addEventListener('DOMContentLoaded', init);
}());
