// I am creating a new file named script.js 

document.addEventListener('DOMContentLoaded', () => {

    // --- CUSTOM CURSOR ---
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 100);
    });

    // Cursor hover effects
    const hoverElements = document.querySelectorAll('a, button, .feature-card, .tech-item, .floating-card');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursorFollower.style.transform = 'scale(0.5)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursorFollower.style.transform = 'scale(1)';
        });
    });

    // --- THREE.JS ENHANCED BACKGROUND ---
    let scene, camera, renderer, particles, mouseX = 0, mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    function initThree() {
        const container = document.getElementById('canvas-container');
        
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 1000;

        // Create multiple particle systems
        const particleSystems = [];
        const colors = [0x00ff88, 0x00cc66, 0x0088ff, 0xff6b6b, 0x4ecdc4];
        
        colors.forEach((color, index) => {
            const geometry = new THREE.BufferGeometry();
            const vertices = [];
            const numParticles = 1500;

            for (let i = 0; i < numParticles; i++) {
                const x = Math.random() * 3000 - 1500;
                const y = Math.random() * 3000 - 1500;
                const z = Math.random() * 3000 - 1500;
                vertices.push(x, y, z);
            }

            geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

            const material = new THREE.PointsMaterial({
                color: color,
                size: 1.5,
                transparent: true,
                opacity: 0.6,
                blending: THREE.AdditiveBlending
            });

            const particleSystem = new THREE.Points(geometry, material);
            particleSystem.userData = { speed: 0.5 + index * 0.2, direction: index % 2 === 0 ? 1 : -1 };
            scene.add(particleSystem);
            particleSystems.push(particleSystem);
        });

        particles = particleSystems;

        renderer = new THREE.WebGLRenderer({ 
            alpha: true,
            antialias: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        document.addEventListener('mousemove', onDocumentMouseMove, false);
        window.addEventListener('resize', onWindowResize, false);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onDocumentMouseMove(event) {
        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
    }

    function animateThree() {
        requestAnimationFrame(animateThree);
        renderThree();
    }

    function renderThree() {
        const time = Date.now() * 0.00005;
        
        // Smooth camera movement
        camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        // Animate each particle system
        particles.forEach((particleSystem, index) => {
            const speed = particleSystem.userData.speed;
            const direction = particleSystem.userData.direction;
            
            particleSystem.rotation.x = time * speed * direction;
            particleSystem.rotation.y = time * speed * direction * 0.5;
            
            // Add wave effect
            particleSystem.position.y = Math.sin(time * 2 + index) * 50;
        });
        
        renderer.render(scene, camera);
    }

    initThree();
    animateThree();

    // --- GSAP ANIMATIONS ---
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Navbar entrance animation
    gsap.from(".navbar", {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.5
    });

    // Hero Section Animations
    const heroTl = gsap.timeline({ delay: 1 });
    
    // Animate title lines
    gsap.from(".title-line", {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
    });

    heroTl.from(".hero-subtitle", { 
        opacity: 0, 
        y: 50, 
        duration: 1, 
        ease: "power3.out" 
    })
    .from(".hero-buttons .cta-button", { 
        opacity: 0, 
        scale: 0.8, 
        duration: 0.8, 
        stagger: 0.1, 
        ease: "elastic.out(1, 0.5)" 
    }, "-=0.5")
    .from(".floating-card", {
        opacity: 0,
        scale: 0,
        duration: 1,
        stagger: 0.2,
        ease: "back.out(1.7)"
    }, "-=0.5");

    // Floating elements parallax
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach(card => {
        const speed = parseFloat(card.dataset.speed);
        
        gsap.to(card, {
            y: -50 * speed,
            scrollTrigger: {
                trigger: ".hero",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // Scroll indicator animation
    gsap.to(".scroll-indicator", {
        opacity: 0,
        y: -20,
        scrollTrigger: {
            trigger: ".hero",
            start: "bottom center",
            end: "bottom top",
            scrub: true
        }
    });

    // Section title animations
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: "top 80%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: "power3.out"
        });
    });

    // Feature cards animation
    gsap.from(".feature-card", {
        scrollTrigger: {
            trigger: ".features",
            start: "top 60%",
            toggleActions: "play none none none"
        },
        opacity: 0,
        y: 100,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
    });

    // Feature icons animation
    gsap.from(".feature-icon", {
        scrollTrigger: {
            trigger: ".features",
            start: "top 60%",
            toggleActions: "play none none none"
        },
        scale: 0,
        rotation: 180,
        duration: 1,
        stagger: 0.2,
        ease: "back.out(1.7)"
    });

    // Technology section animation
    gsap.from(".tech-item", {
        scrollTrigger: {
            trigger: ".technology",
            start: "top 60%",
            toggleActions: "play none none none"
        },
        opacity: 0,
        x: (i, target) => i % 2 === 0 ? -100 : 100,
        duration: 1,
        stagger: 0.3,
        ease: "power3.out"
    });

    // About section animations
    gsap.from(".about-text", {
        scrollTrigger: {
            trigger: ".about",
            start: "top 60%",
            toggleActions: "play none none none"
        },
        opacity: 0,
        x: -100,
        duration: 1,
        ease: "power3.out"
    });

    gsap.from(".about-image", {
        scrollTrigger: {
            trigger: ".about",
            start: "top 60%",
            toggleActions: "play none none none"
        },
        opacity: 0,
        x: 100,
        scale: 0.8,
        duration: 1,
        ease: "power3.out"
    });

    gsap.from(".image-badge", {
        scrollTrigger: {
            trigger: ".about",
            start: "top 60%",
            toggleActions: "play none none none"
        },
        opacity: 0,
        scale: 0,
        rotation: 180,
        duration: 1,
        delay: 0.5,
        ease: "back.out(1.7)"
    });

    gsap.from(".about-stat", {
        scrollTrigger: {
            trigger: ".about",
            start: "top 60%",
            toggleActions: "play none none none"
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
    });

    // CTA section animation
    const ctaElements = document.querySelectorAll(".cta .section-title, .cta p, .cta .cta-button");
    gsap.from(ctaElements, {
        scrollTrigger: {
            trigger: ".cta",
            start: "top 70%",
            toggleActions: "play none none none"
        },
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out"
    });

    // Footer animation
    gsap.from(".footer-section", {
        scrollTrigger: {
            trigger: ".footer",
            start: "top 80%",
            toggleActions: "play none none none"
        },
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
    });

    // Counter animations for stats
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const originalText = counter.textContent.trim();

        // Check if the text contains any digit
        if (/[\\d]/.test(originalText)) {
            const target = parseFloat(originalText.replace(/[^\\d.]+/g, ''));
            const suffix = originalText.replace(/[\\d.]+/g, '');
            let proxy = { val: 0 };

            gsap.to(proxy, {
                val: target,
                scrollTrigger: {
                    trigger: counter,
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                duration: 2,
                ease: "power2.out",
                onUpdate: () => {
                    if (originalText.includes('.')) {
                        counter.textContent = proxy.val.toFixed(1) + suffix;
                    } else {
                        counter.textContent = Math.floor(proxy.val) + suffix;
                    }
                },
                onComplete: () => {
                   counter.textContent = originalText;
                }
            });
        } else { // It's not a number (like "Real-time"), just reveal it
            gsap.from(counter, {
                scrollTrigger: {
                    trigger: counter,
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                opacity: 0,
                y: 20,
                duration: 1,
                ease: "power2.out"
            });
        }
    });

    // Smooth scroll for navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                gsap.to(window, {
                    scrollTo: {
                        y: targetSection,
                        offsetY: 80
                    },
                    duration: 1.5,
                    ease: "power2.inOut"
                });
            }
        });
    });

    // Button click animations and functionality
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('click', () => {
            // Click animation
            gsap.to(button, {
                scale: 0.95,
                duration: 0.1,
                ease: "power2.out",
                yoyo: true,
                repeat: 1
            });

            // Button-specific functionality
            const buttonClass = button.classList;
            if (buttonClass.contains('analytics')) {
                showNotification('Analytics Dashboard', 'Opening analytics platform...', 'analytics');
            } else if (buttonClass.contains('math')) {
                showNotification('Math AI', 'Launching mathematical AI tools...', 'math');
            } else if (buttonClass.contains('ml')) {
                showNotification('Machine Learning', 'Initializing ML models...', 'ml');
            } else if (buttonClass.contains('primary')) {
                showNotification('Contact', 'Opening contact form...', 'primary');
            } else if (buttonClass.contains('secondary')) {
                showNotification('Demo', 'Loading demo environment...', 'secondary');
            }
        });
    });

    // Notification system
    function showNotification(title, message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
            <div class="notification-progress"></div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        gsap.fromTo(notification, {
            x: 400,
            opacity: 0
        }, {
            x: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power3.out"
        });

        // Progress bar animation
        gsap.to(notification.querySelector('.notification-progress'), {
            width: '0%',
            duration: 3,
            ease: "none"
        });

        // Remove notification after 3 seconds
        setTimeout(() => {
            gsap.to(notification, {
                x: 400,
                opacity: 0,
                duration: 0.5,
                ease: "power3.in",
                onComplete: () => {
                    document.body.removeChild(notification);
                }
            });
        }, 3000);
    }

    // Feature card hover animations
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: 1.02,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });

    // Floating cards interaction
    document.querySelectorAll('.floating-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: 1.2,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        // Click interaction for floating cards
        card.addEventListener('click', () => {
            const icon = card.querySelector('i');
            const text = card.querySelector('span').textContent;
            
            gsap.to(card, {
                scale: 1.3,
                duration: 0.2,
                ease: "power2.out",
                yoyo: true,
                repeat: 1
            });

            showNotification(text, `Exploring ${text.toLowerCase()} features...`, 'floating');
        });
    });

    // Mobile menu toggle (if needed)
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Parallax effect for images
    gsap.utils.toArray('img').forEach(img => {
        gsap.to(img, {
            y: -50,
            scrollTrigger: {
                trigger: img,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // Text reveal animations
    const textElements = document.querySelectorAll('p, h3');
    textElements.forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: "top 90%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power3.out"
        });
    });

    // Add notification styles dynamically
    const notificationStyles = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--secondary-color);
            border: 1px solid var(--accent-color);
            border-radius: 10px;
            padding: 20px;
            min-width: 300px;
            z-index: 10000;
            backdrop-filter: blur(10px);
        }
        .notification-content h4 {
            color: var(--accent-color);
            margin-bottom: 5px;
            font-family: var(--heading-font);
        }
        .notification-content p {
            color: var(--text-muted);
            font-size: 14px;
        }
        .notification-progress {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            background: var(--accent-color);
            width: 100%;
        }
        .notification-analytics {
            border-color: var(--analytics-color);
        }
        .notification-math {
            border-color: var(--math-color);
        }
        .notification-ml {
            border-color: var(--ml-color);
        }
        .notification-floating {
            border-color: var(--accent-color);
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = notificationStyles;
    document.head.appendChild(styleSheet);

}); 