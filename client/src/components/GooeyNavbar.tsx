import { useRef, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { logout, getCurrentUser } from '../services/auth';
import '../styles/gooey.css';

const GooeyNavbar = ({
    animationTime = 600,
    particleCount = 15,
    particleDistances = [90, 10],
    particleR = 100,
    timeVariance = 300,
    colors = [1, 2, 3, 1, 2, 3, 1, 4],
}) => {
    const location = useLocation();
    const user = getCurrentUser();
    const items = [
        { label: "Home", href: "/" },
        { label: "Committee Members", href: "/about" },
        { label: "Events", href: "/events" },
        { label: "Contact", href: "/contact" },
    ];

    const containerRef = useRef(null);
    const navRef = useRef(null);
    const filterRef = useRef(null);
    const textRef = useRef(null);

    // Find index based on current path
    const currentPathIndex = items.findIndex(item => item.href === location.pathname);
    const [activeIndex, setActiveIndex] = useState(currentPathIndex !== -1 ? currentPathIndex : 0);

    const noise = (n = 1) => n / 2 - Math.random() * n;

    const getXY = (distance, pointIndex, totalPoints) => {
        const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
        return [distance * Math.cos(angle), distance * Math.sin(angle)];
    };

    const createParticle = (i, t, d, r) => {
        let rotate = noise(r / 10);
        return {
            start: getXY(d[0], particleCount - i, particleCount),
            end: getXY(d[1] + noise(7), particleCount - i, particleCount),
            time: t,
            scale: 1 + noise(0.2),
            color: colors[Math.floor(Math.random() * colors.length)],
            rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10
        };
    };

    const makeParticles = element => {
        const d = particleDistances;
        const r = particleR;
        const bubbleTime = animationTime * 2 + timeVariance;
        element.style.setProperty('--time', `${bubbleTime}ms`);

        for (let i = 0; i < particleCount; i++) {
            const t = animationTime * 2 + noise(timeVariance * 2);
            const p = createParticle(i, t, d, r);
            element.classList.remove('active');

            setTimeout(() => {
                const particle = document.createElement('span');
                const point = document.createElement('span');
                particle.classList.add('particle');
                particle.style.setProperty('--start-x', `${p.start[0]}px`);
                particle.style.setProperty('--start-y', `${p.start[1]}px`);
                particle.style.setProperty('--end-x', `${p.end[0]}px`);
                particle.style.setProperty('--end-y', `${p.end[1]}px`);
                particle.style.setProperty('--time', `${p.time}ms`);
                particle.style.setProperty('--scale', `${p.scale}`);
                particle.style.setProperty('--color', `var(--color-${p.color}, white)`);
                particle.style.setProperty('--rotate', `${p.rotate}deg`);

                point.classList.add('point');
                particle.appendChild(point);
                element.appendChild(particle);
                requestAnimationFrame(() => {
                    element.classList.add('active');
                });
                setTimeout(() => {
                    try {
                        element.removeChild(particle);
                    } catch {
                        // Do nothing
                    }
                }, t);
            }, 30);
        }
    };

    const updateEffectPosition = element => {
        if (!containerRef.current || !filterRef.current || !textRef.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        const pos = element.getBoundingClientRect();

        const styles = {
            left: `${pos.x - containerRect.x}px`,
            top: `${pos.y - containerRect.y}px`,
            width: `${pos.width}px`,
            height: `${pos.height}px`
        };
        Object.assign(filterRef.current.style, styles);
        Object.assign(textRef.current.style, styles);
        // @ts-ignore
        textRef.current.innerText = element.innerText;
    };

    const handleClick = (e, index) => {
        const liEl = e.currentTarget;
        if (activeIndex === index) return;

        setActiveIndex(index);
        updateEffectPosition(liEl);

        if (filterRef.current) {
            // @ts-ignore
            const particles = filterRef.current.querySelectorAll('.particle');
            particles.forEach(p => filterRef.current.removeChild(p));
        }

        if (textRef.current) {
            // @ts-ignore
            textRef.current.classList.remove('active');
            // @ts-ignore
            void textRef.current.offsetWidth;
            // @ts-ignore
            textRef.current.classList.add('active');
        }

        if (filterRef.current) {
            makeParticles(filterRef.current);
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const liEl = e.currentTarget.parentElement;
            if (liEl) {
                handleClick({ currentTarget: liEl }, index);
            }
        }
    };

    // Sync with location changes
    useEffect(() => {
        const idx = items.findIndex(item => item.href === location.pathname);
        if (idx !== -1 && idx !== activeIndex) {
            setActiveIndex(idx);
        }
    }, [location.pathname]);

    useEffect(() => {
        if (!navRef.current || !containerRef.current) return;
        // @ts-ignore
        const activeLi = navRef.current.querySelectorAll('li')[activeIndex];
        if (activeLi) {
            updateEffectPosition(activeLi);
            // @ts-ignore
            textRef.current?.classList.add('active');
        }

        const resizeObserver = new ResizeObserver(() => {
            // @ts-ignore
            const currentActiveLi = navRef.current?.querySelectorAll('li')[activeIndex];
            if (currentActiveLi) {
                updateEffectPosition(currentActiveLi);
            }
        });

        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, [activeIndex]);

    return (
        <>
            <div className="gooey-nav-container" ref={containerRef}>
                <nav>
                    <ul ref={navRef}>
                        {items.map((item, index) => (
                            <li key={index} className={activeIndex === index ? 'active' : ''} onClick={e => handleClick(e, index)}>
                                <Link to={item.href} onKeyDown={e => handleKeyDown(e, index)}>
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                {/* SVG Filter for Gooey Effect */}
                <svg style={{ visibility: 'hidden', position: 'absolute' }}>
                    <defs>
                        <filter id="goo">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                            <feColorMatrix
                                in="blur"
                                mode="matrix"
                                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                                result="goo"
                            />
                            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                        </filter>
                    </defs>
                </svg>
                <span className="effect filter" ref={filterRef} />
                <span className="effect text" ref={textRef} />

            </div>

            <div className="auth-buttons-container" style={{ position: 'fixed', top: '20px', right: '30px', zIndex: 1000 }}>
                {!user ? (
                    <Link to="/login" className="cyber-btn">LOGIN</Link>
                ) : (
                    <div className="d-flex align-items-center gap-2">
                        <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn btn-outline-light rounded-pill btn-sm">Dashboard</Link>
                        <button onClick={logout} className="btn btn-danger rounded-pill btn-sm px-3">Logout</button>
                    </div>
                )}
            </div>
            {/* Spacer for fixed nav - hidden on Home for full immersiveness */}
            {location.pathname !== '/' && <div style={{ height: '150px' }}></div>}
        </>
    );
};

export default GooeyNavbar;
