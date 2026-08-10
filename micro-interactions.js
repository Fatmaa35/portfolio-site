(function () {
    'use strict';

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    function reducedMotion() {
        return reducedMotionQuery.matches || document.body.classList.contains('reduce-motion');
    }

    function initHeroParallax() {
        const home = document.querySelector('.home');
        if (!home) return;
        let active = true;
        let frame;
        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;

        const apply = () => {
            frame = undefined;
            currentX += (targetX - currentX) * 0.075;
            currentY += (targetY - currentY) * 0.075;
            home.style.setProperty('--parallax-content-x', `${-currentX * 10}px`);
            home.style.setProperty('--parallax-content-y', `${-currentY * 7}px`);
            home.style.setProperty('--parallax-image-x', `${currentX * 13}px`);
            home.style.setProperty('--parallax-image-y', `${currentY * 10}px`);
            home.style.setProperty('--parallax-ambient-x', `${currentX * 20}px`);
            home.style.setProperty('--parallax-ambient-y', `${currentY * 14}px`);
            if (Math.abs(targetX - currentX) > 0.002 || Math.abs(targetY - currentY) > 0.002) frame = requestAnimationFrame(apply);
        };

        const reset = () => {
            targetX = 0;
            targetY = 0;
            if (!frame) frame = requestAnimationFrame(apply);
        };

        window.addEventListener('pointermove', (event) => {
            if (!active || reducedMotion()) return;
            const rect = home.getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > window.innerHeight) return;
            targetX = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2));
            targetY = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2));
            if (!frame) frame = requestAnimationFrame(apply);
        }, { passive: true });
        home.addEventListener('pointerleave', reset, { passive: true });

        if ('IntersectionObserver' in window) {
            new IntersectionObserver(([entry]) => {
                active = entry.isIntersecting;
                if (!active) reset();
            }, { threshold: 0.08 }).observe(home);
        }
        new MutationObserver(() => {
            if (reducedMotion()) reset();
        }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }

    function initScrollTransition() {
        if (typeof THREE === 'undefined') return;
        const container = document.createElement('div');
        container.id = 'scroll-webgl-transition';
        container.setAttribute('aria-hidden', 'true');
        document.body.appendChild(container);

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const material = new THREE.ShaderMaterial({
            transparent: true,
            depthWrite: false,
            uniforms: {
                uTime: { value: 0 },
                uStrength: { value: 0 },
                uAspect: { value: 1 },
                uDirection: { value: 1 }
            },
            vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position, 1.0); }`,
            fragmentShader: `
                varying vec2 vUv;
                uniform float uTime;
                uniform float uStrength;
                uniform float uAspect;
                uniform float uDirection;
                void main() {
                    vec2 p = vUv - 0.5;
                    p.x *= uAspect;
                    p += vec2(0.12 * uDirection, -0.04);
                    float radius = length(p);
                    float wave = 0.24 + sin(uTime * 1.15) * 0.018;
                    float ring = smoothstep(0.024, 0.0, abs(radius - wave));
                    float echo = smoothstep(0.016, 0.0, abs(radius - (wave + 0.115)));
                    vec3 cyan = vec3(0.0, 1.0, 0.8);
                    vec3 purple = vec3(0.66, 0.33, 0.97);
                    vec3 color = mix(cyan, purple, smoothstep(-0.7, 0.7, p.x));
                    float alpha = (ring * 0.18 + echo * 0.07) * uStrength;
                    gl_FragColor = vec4(color, alpha);
                }
            `
        });
        scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

        let targetStrength = 0;
        let currentStrength = 0;
        let direction = 1;
        let lastScrollY = window.scrollY;
        let frame;
        const sectionSelectors = ['.home', '.skill-universe', '.journey-tunnel', '.education', '.projects', '.blog', '.resume', '.contact', '.footer'];

        const resize = () => {
            renderer.setSize(window.innerWidth, window.innerHeight, false);
            material.uniforms.uAspect.value = window.innerWidth / window.innerHeight;
        };
        const updateTarget = () => {
            const currentScrollY = window.scrollY;
            direction = currentScrollY >= lastScrollY ? 1 : -1;
            lastScrollY = currentScrollY;
            const distance = window.innerHeight * 0.13;
            targetStrength = sectionSelectors.reduce((strongest, selector) => {
                const section = document.querySelector(selector);
                if (!section) return strongest;
                const proximity = 1 - Math.min(1, Math.abs(section.getBoundingClientRect().top) / distance);
                return Math.max(strongest, proximity);
            }, 0);
            if (!frame && !reducedMotion()) frame = requestAnimationFrame(render);
        };
        const render = (time) => {
            frame = undefined;
            if (reducedMotion()) return;
            currentStrength += (targetStrength - currentStrength) * 0.1;
            material.uniforms.uTime.value = time * 0.001;
            material.uniforms.uStrength.value = currentStrength;
            material.uniforms.uDirection.value = direction;
            renderer.render(scene, camera);
            if (currentStrength > 0.004 || targetStrength > 0.004) frame = requestAnimationFrame(render);
        };

        resize();
        updateTarget();
        window.addEventListener('resize', resize, { passive: true });
        window.addEventListener('scroll', updateTarget, { passive: true });
        new MutationObserver(() => {
            if (!reducedMotion()) updateTarget();
        }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }

    function init() {
        initHeroParallax();
        initScrollTransition();
    }

    window.addEventListener('DOMContentLoaded', init);
}());
