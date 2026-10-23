(function () {
    'use strict';

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const effects = [];
    let animationFrame;
    let lastTime = 0;

    function reduceMotion() {
        return reducedMotionQuery.matches || document.body.classList.contains('reduce-motion');
    }

    function createViewport(container, cameraDistance) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 30);
        camera.position.z = cameraDistance;
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.35));
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        const resize = () => {
            const { width, height } = container.getBoundingClientRect();
            if (!width || !height) return;
            renderer.setSize(width, height, false);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };

        return { scene, camera, renderer, resize, render: () => renderer.render(scene, camera) };
    }

    function addEffect(effect, element) {
        effect.visible = true;
        effects.push(effect);
        effect.resize();
        effect.render();

        if ('IntersectionObserver' in window) {
            new IntersectionObserver(([entry]) => {
                effect.visible = entry.isIntersecting;
                if (effect.visible) effect.render();
                updateAnimationState();
            }, { threshold: 0.04 }).observe(element);
        }
    }

    function renderAll() {
        effects.forEach((effect) => effect.render());
    }

    function updateAnimationState() {
        const canAnimate = !reduceMotion() && effects.some((effect) => effect.visible);
        if (canAnimate && !animationFrame) animationFrame = requestAnimationFrame(animate);
        if (!canAnimate && animationFrame) {
            cancelAnimationFrame(animationFrame);
            animationFrame = undefined;
            renderAll();
        }
    }

    function animate(time) {
        animationFrame = undefined;
        const elapsed = Math.min((time - lastTime) / 1000 || 0.016, 0.05);
        lastTime = time;
        effects.forEach((effect) => {
            if (!effect.visible) return;
            effect.update(elapsed, time / 1000);
            effect.render();
        });
        updateAnimationState();
    }

    function makeLineSegments(pointPositions, pairs, color, opacity) {
        const values = new Float32Array(pairs.length * 6);
        pairs.forEach(([first, second], index) => {
            const output = index * 6;
            const firstOffset = first * 3;
            const secondOffset = second * 3;
            values.set(pointPositions.slice(firstOffset, firstOffset + 3), output);
            values.set(pointPositions.slice(secondOffset, secondOffset + 3), output + 3);
        });
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(values, 3));
        return new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity }));
    }

    function initAmbientNetwork() {
        const container = document.getElementById('ambient-data-network');
        if (!container) return;

        const view = createViewport(container, 6.4);
        const pointCount = 52;
        const positions = new Float32Array(pointCount * 3);
        const targets = new Float32Array(pointCount * 3);
        const colors = new Float32Array(pointCount * 3);
        const geometry = new THREE.BufferGeometry();
        const cyan = new THREE.Color(0x00ffcc);
        const purple = new THREE.Color(0xa855f7);

        for (let index = 0; index < pointCount; index += 1) {
            const offset = index * 3;
            positions[offset] = Math.sin(index * 13.1) * 2.8;
            positions[offset + 1] = Math.cos(index * 7.7) * 2.2;
            positions[offset + 2] = Math.sin(index * 3.4) * 0.7;
            targets.set(positions.slice(offset, offset + 3), offset);
            const color = index % 3 === 0 ? purple : cyan;
            colors.set([color.r, color.g, color.b], offset);
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        const points = new THREE.Points(geometry, new THREE.PointsMaterial({
            size: 0.045,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            sizeAttenuation: true
        }));

        const group = new THREE.Group();
        group.add(points);
        view.scene.add(group);
        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pointCount * pointCount * 3), 3));
        lineGeometry.setDrawRange(0, 0);
        const lines = new THREE.LineSegments(lineGeometry, new THREE.LineBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.2 }));
        group.add(lines);

        const updateConnections = () => {
            const output = lines.geometry.attributes.position.array;
            let length = 0;
            for (let first = 0; first < pointCount; first += 1) {
                for (let second = first + 1; second < pointCount; second += 1) {
                    const firstOffset = first * 3;
                    const secondOffset = second * 3;
                    const dx = positions[firstOffset] - positions[secondOffset];
                    const dy = positions[firstOffset + 1] - positions[secondOffset + 1];
                    const dz = positions[firstOffset + 2] - positions[secondOffset + 2];
                    if ((dx * dx) + (dy * dy) + (dz * dz) > 1.5) continue;
                    output.set(positions.slice(firstOffset, firstOffset + 3), length);
                    output.set(positions.slice(secondOffset, secondOffset + 3), length + 3);
                    length += 6;
                }
            }
            lines.geometry.attributes.position.needsUpdate = true;
            lines.geometry.setDrawRange(0, length / 3);
        };

        const setTargetPattern = (role) => {
            for (let index = 0; index < pointCount; index += 1) {
                const offset = index * 3;
                let x;
                let y;
                let z;
                if (role === 'recruiter') {
                    const centers = [[-2.1, 1.25], [1.9, 1.2], [-1.75, -1.35], [1.7, -1.2]];
                    const center = centers[index % centers.length];
                    const radius = 0.18 + (index % 7) * 0.13;
                    const angle = index * 1.7;
                    x = center[0] + Math.cos(angle) * radius;
                    y = center[1] + Math.sin(angle) * radius;
                    z = Math.sin(index * 2.4) * 0.45;
                } else if (role === 'client') {
                    const angle = (index / pointCount) * Math.PI * 2;
                    const radius = index % 2 ? 2.45 : 1.35;
                    x = Math.cos(angle) * radius;
                    y = Math.sin(angle) * radius;
                    z = Math.sin(angle * 3) * 0.55;
                } else if (role === 'student') {
                    const angle = index * 0.6;
                    const radius = 0.12 + (index / pointCount) * 2.8;
                    x = Math.cos(angle) * radius;
                    y = Math.sin(angle) * radius;
                    z = (index / pointCount - 0.5) * 1.25;
                } else {
                    x = Math.sin(index * 13.1) * 2.8;
                    y = Math.cos(index * 7.7) * 2.2;
                    z = Math.sin(index * 3.4) * 0.7;
                }
                targets[offset] = x;
                targets[offset + 1] = y;
                targets[offset + 2] = z;
            }
        };

        setTargetPattern(document.body.dataset.visitorRole);
        updateConnections();
        addEffect({
            resize: view.resize,
            render: view.render,
            update: (_, time) => {
                for (let index = 0; index < positions.length; index += 1) positions[index] += (targets[index] - positions[index]) * 0.028;
                geometry.attributes.position.needsUpdate = true;
                group.rotation.y = Math.sin(time * 0.12) * 0.09;
                group.rotation.x = Math.cos(time * 0.09) * 0.04;
                updateConnections();
            },
            setTargetPattern
        }, container);
    }

    function createProjectFlow(card, type) {
        const container = document.createElement('div');
        container.className = `project-flow project-flow--${type}`;
        container.setAttribute('aria-hidden', 'true');
        card.prepend(container);
        const view = createViewport(container, 5.2);
        const count = 24;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const cyan = new THREE.Color(0x00ffcc);
        const purple = new THREE.Color(0xa855f7);
        const green = new THREE.Color(0x77f59a);

        for (let index = 0; index < count; index += 1) {
            const offset = index * 3;
            if (type === 'green') {
                const angle = (index / count) * Math.PI * 2;
                positions[offset] = Math.cos(angle) * (1.05 + Math.sin(angle * 2) * 0.38);
                positions[offset + 1] = Math.sin(angle) * 1.5;
                positions[offset + 2] = Math.sin(angle * 3) * 0.35;
            } else if (type === 'data') {
                const cluster = index % 2 ? 1 : -1;
                positions[offset] = cluster * 1.25 + Math.sin(index * 2.6) * 0.45;
                positions[offset + 1] = Math.cos(index * 1.7) * 0.9;
                positions[offset + 2] = Math.sin(index * 1.1) * 0.3;
            } else {
                positions[offset] = -2.15 + (index % 8) * 0.6;
                positions[offset + 1] = -0.9 + Math.floor(index / 8) * 0.85;
                positions[offset + 2] = Math.sin(index * 1.8) * 0.35;
            }
            const color = type === 'green' ? (index % 3 ? green : cyan) : (index % 3 ? cyan : purple);
            colors.set([color.r, color.g, color.b], offset);
        }

        const pointGeometry = new THREE.BufferGeometry();
        pointGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        pointGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        const group = new THREE.Group();
        group.add(new THREE.Points(pointGeometry, new THREE.PointsMaterial({ size: 0.05, vertexColors: true, transparent: true, opacity: 0.9 })));
        const pairs = [];
        for (let index = 0; index < count - 1; index += 1) {
            if (type === 'route' && index % 8 === 7) continue;
            pairs.push([index, index + 1]);
            if (index + 8 < count && type === 'route') pairs.push([index, index + 8]);
        }
        group.add(makeLineSegments(positions, pairs, type === 'green' ? 0x77f59a : 0x00ffcc, 0.22));
        let simulationMarker;
        if (type === 'green') {
            simulationMarker = new THREE.Mesh(
                new THREE.SphereGeometry(0.09, 12, 12),
                new THREE.MeshBasicMaterial({ color: 0xe8fff4 })
            );
            group.add(simulationMarker);
        } else if (type === 'route') {
            simulationMarker = new THREE.Mesh(
                new THREE.BoxGeometry(0.18, 0.08, 0.3),
                new THREE.MeshBasicMaterial({ color: 0xe8fff4 })
            );
            group.add(simulationMarker);
        }
        view.scene.add(group);

        addEffect({
            resize: view.resize,
            render: view.render,
            update: (_, time) => {
                group.rotation.z = Math.sin(time * 0.55) * 0.08;
                group.position.x = Math.sin(time * 0.8) * 0.12;
                group.position.y = Math.cos(time * 0.7) * 0.08;
                if (type === 'green') {
                    simulationMarker.position.set(Math.cos(time * 1.15) * 1.2, Math.sin(time * 1.15) * 1.52, 0.45);
                } else if (type === 'route') {
                    const travel = (time * 0.32) % 1;
                    simulationMarker.position.set(-2.1 + travel * 4.2, -0.9 + Math.sin(travel * Math.PI) * 1.5, 0.42);
                }
            }
        }, card);
    }

    function initSkillUniverse() {
        const container = document.getElementById('skill-universe-canvas');
        if (!container) return;
        const view = createViewport(container, 7);
        const world = new THREE.Group();
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();
        const planetMeshes = [];
        const skillProjects = {
            python: ['greenedge', 'telco', 'liman', 'port'],
            ai: ['greenedge', 'telco', 'liman', 'port'],
            react: ['liman', 'port'],
            sql: ['liman', 'port'],
            web: ['yoldaki', 'liman', 'port']
        };
        const skills = [
            { id: 'python', color: 0x00ffcc, size: 0.52, position: [-2.25, 1.15, 0.1] },
            { id: 'ai', color: 0xa855f7, size: 0.72, position: [0, 0.3, 0.5] },
            { id: 'react', color: 0x4fc3f7, size: 0.43, position: [2.15, 1.2, -0.1] },
            { id: 'sql', color: 0x77f59a, size: 0.48, position: [-1.7, -1.65, -0.2] },
            { id: 'web', color: 0xffc857, size: 0.42, position: [2.05, -1.45, 0.1] }
        ];

        view.scene.add(new THREE.AmbientLight(0xffffff, 0.95));
        const glow = new THREE.PointLight(0x00ffcc, 2.4, 12);
        glow.position.set(0, 1.5, 3);
        view.scene.add(glow);
        view.scene.add(world);

        const starPositions = new Float32Array(95 * 3);
        for (let index = 0; index < 95; index += 1) {
            const offset = index * 3;
            starPositions[offset] = Math.sin(index * 12.7) * 4.4;
            starPositions[offset + 1] = Math.cos(index * 6.1) * 3.3;
            starPositions[offset + 2] = -1.7 + Math.sin(index * 2.8) * 1.2;
        }
        const starGeometry = new THREE.BufferGeometry();
        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        world.add(new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0x9cf7e6, size: 0.035, transparent: true, opacity: 0.65 })));

        skills.forEach((skill, index) => {
            const material = new THREE.MeshStandardMaterial({
                color: skill.color,
                emissive: skill.color,
                emissiveIntensity: 0.28,
                metalness: 0.25,
                roughness: 0.38
            });
            const planet = new THREE.Mesh(new THREE.IcosahedronGeometry(skill.size, 2), material);
            planet.position.set(...skill.position);
            planet.userData = { id: skill.id, baseScale: skill.size, material, phase: index * 0.9 };
            const orbit = new THREE.Mesh(
                new THREE.TorusGeometry(skill.size * 1.55, 0.012, 6, 48),
                new THREE.MeshBasicMaterial({ color: skill.color, transparent: true, opacity: 0.34 })
            );
            orbit.rotation.x = Math.PI / 2.8;
            planet.add(orbit);
            world.add(planet);
            planetMeshes.push(planet);
        });

        let selectedSkill;
        const selectSkill = (skillId) => {
            selectedSkill = skillId;
            document.body.classList.toggle('has-skill-selection', Boolean(skillId));
            document.querySelectorAll('[data-skill]').forEach((button) => {
                const selected = button.dataset.skill === skillId;
                button.classList.toggle('is-active', selected);
                button.setAttribute('aria-pressed', String(selected));
            });
            planetMeshes.forEach((planet) => {
                const selected = planet.userData.id === skillId;
                planet.userData.material.emissiveIntensity = selected ? 0.82 : 0.2;
                planet.scale.setScalar(selected ? 1.26 : 1);
            });
            document.querySelectorAll('.project-card').forEach((card) => {
                const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
                const relevant = skillId && skillProjects[skillId].some((keyword) => title.includes(keyword));
                card.classList.toggle('skill-project-highlight', relevant);
                if (relevant) {
                    card.dataset.skillMatch = document.documentElement.lang === 'en' ? 'Relevant skill' : 'Ilgili beceri';
                } else {
                    delete card.dataset.skillMatch;
                }
            });
            view.render();
        };

        document.querySelectorAll('[data-skill]').forEach((button) => {
            button.setAttribute('aria-pressed', 'false');
            button.addEventListener('click', () => selectSkill(button.dataset.skill));
        });
        container.addEventListener('click', (event) => {
            const rect = container.getBoundingClientRect();
            pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(pointer, view.camera);
            const selected = raycaster.intersectObjects(planetMeshes, false)[0];
            if (selected) selectSkill(selected.object.userData.id);
        });

        addEffect({
            resize: view.resize,
            render: view.render,
            update: (_, time) => {
                world.rotation.y = time * 0.08;
                world.rotation.x = Math.sin(time * 0.24) * 0.06;
                planetMeshes.forEach((planet) => {
                    const scale = planet.userData.id === selectedSkill ? 1.26 : 1;
                    planet.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.06);
                    planet.rotation.y = time * (0.24 + planet.userData.phase * 0.02);
                });
            }
        }, container);
    }

    function initJourneyTunnel() {
        const container = document.getElementById('journey-tunnel-canvas');
        const section = document.getElementById('journey');
        if (!container || !section) return;
        const view = createViewport(container, 6.6);
        const tunnel = new THREE.Group();
        const milestones = new THREE.Group();
        let scrollProgress = 0;
        view.scene.add(tunnel, milestones);

        for (let index = 0; index < 22; index += 1) {
            const ring = new THREE.Mesh(
                new THREE.TorusGeometry(1.72 + (index % 3) * 0.08, 0.018, 6, 40),
                new THREE.MeshBasicMaterial({
                    color: index % 2 ? 0x00ffcc : 0xa855f7,
                    transparent: true,
                    opacity: 0.32
                })
            );
            ring.position.z = -index * 0.72;
            ring.rotation.z = index * 0.22;
            tunnel.add(ring);
        }

        const route = [];
        for (let index = 0; index < 64; index += 1) {
            const z = 1 - index * 0.25;
            route.push(new THREE.Vector3(Math.sin(index * 0.25) * 0.55, Math.cos(index * 0.19) * 0.38, z));
        }
        const routeGeometry = new THREE.BufferGeometry().setFromPoints(route);
        tunnel.add(new THREE.Line(routeGeometry, new THREE.LineBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.76 })));

        [-2.2, -7.4, -12.4].forEach((z, index) => {
            const marker = new THREE.Mesh(
                new THREE.IcosahedronGeometry(0.18, 1),
                new THREE.MeshBasicMaterial({ color: index === 1 ? 0xa855f7 : 0x00ffcc })
            );
            marker.position.set(Math.sin(index * 1.7) * 0.58, Math.cos(index * 1.3) * 0.36, z);
            milestones.add(marker);
        });

        const updateScroll = () => {
            const rect = section.getBoundingClientRect();
            scrollProgress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
        };
        updateScroll();
        window.addEventListener('scroll', updateScroll, { passive: true });

        addEffect({
            resize: view.resize,
            render: view.render,
            update: (_, time) => {
                view.camera.position.z += ((6.6 - scrollProgress * 4.7) - view.camera.position.z) * 0.06;
                view.camera.position.x = Math.sin(time * 0.28) * 0.1;
                view.camera.position.y = Math.cos(time * 0.21) * 0.08;
                milestones.rotation.z = time * 0.18;
            }
        }, container);
    }

    function initProjectFlows() {
        if (window.matchMedia('(max-width: 768px)').matches) return;
        document.querySelectorAll('.project-card').forEach((card) => {
            const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
            if (title.includes('greenedge')) createProjectFlow(card, 'green');
            else if (title.includes('telco')) createProjectFlow(card, 'data');
            else if (title.includes('liman') || title.includes('port')) createProjectFlow(card, 'route');
        });
    }

    function initContactSphere() {
        const container = document.getElementById('contact-network-sphere');
        if (!container || window.matchMedia('(max-width: 768px)').matches) return;
        const view = createViewport(container, 5.2);
        const count = 46;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const cyan = new THREE.Color(0x00ffcc);
        const purple = new THREE.Color(0xa855f7);
        const goldenRatio = (1 + Math.sqrt(5)) / 2;

        for (let index = 0; index < count; index += 1) {
            const y = 1 - (index / (count - 1)) * 2;
            const radius = Math.sqrt(1 - y * y);
            const theta = Math.PI * 2 * index / goldenRatio;
            const offset = index * 3;
            positions[offset] = Math.cos(theta) * radius * 1.75;
            positions[offset + 1] = y * 1.75;
            positions[offset + 2] = Math.sin(theta) * radius * 1.75;
            const color = index % 4 === 0 ? purple : cyan;
            colors.set([color.r, color.g, color.b], offset);
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        const group = new THREE.Group();
        group.add(new THREE.Points(geometry, new THREE.PointsMaterial({ size: 0.055, vertexColors: true, transparent: true, opacity: 0.9 })));
        const pairs = [];
        for (let first = 0; first < count; first += 1) {
            for (let second = first + 1; second < count; second += 1) {
                const dx = positions[first * 3] - positions[second * 3];
                const dy = positions[first * 3 + 1] - positions[second * 3 + 1];
                const dz = positions[first * 3 + 2] - positions[second * 3 + 2];
                if ((dx * dx) + (dy * dy) + (dz * dz) < 1.55) pairs.push([first, second]);
            }
        }
        group.add(makeLineSegments(positions, pairs, 0x00ffcc, 0.2));
        view.scene.add(group);

        addEffect({
            resize: view.resize,
            render: view.render,
            update: (_, time) => {
                group.rotation.y = time * 0.22;
                group.rotation.x = Math.sin(time * 0.35) * 0.16;
            }
        }, container);
    }

    function init() {
        if (typeof THREE === 'undefined') return;
        initAmbientNetwork();
        initSkillUniverse();
        initJourneyTunnel();
        initProjectFlows();
        initContactSphere();

        window.addEventListener('resize', () => {
            effects.forEach((effect) => effect.resize());
            renderAll();
        }, { passive: true });
        new MutationObserver(() => {
            const ambient = effects.find((effect) => typeof effect.setTargetPattern === 'function');
            ambient?.setTargetPattern(document.body.dataset.visitorRole);
            renderAll();
            updateAnimationState();
        }).observe(document.body, { attributes: true, attributeFilter: ['class', 'data-visitor-role'] });
        reducedMotionQuery.addEventListener?.('change', updateAnimationState);
        updateAnimationState();
    }

    window.addEventListener('DOMContentLoaded', init);
}());
