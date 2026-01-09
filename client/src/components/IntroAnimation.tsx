import { useEffect, useState } from 'react';

const IntroAnimation = ({ onComplete }: { onComplete: () => void }) => {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        // Phase 1: Initial black screen, HUD fade in starts immediately via CSS
        const t1 = setTimeout(() => setPhase(1), 500); // HUD Fully visible
        const t2 = setTimeout(() => setPhase(2), 1500); // Logo Reaveal
        const t3 = setTimeout(() => setPhase(3), 3500); // Fade out
        const t4 = setTimeout(onComplete, 4000); // Done

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            clearTimeout(t4);
        };
    }, [onComplete]);

    return (
        <div className={`intro-container ${phase === 3 ? 'fade-out' : ''}`}>
            <div className="star-field"></div>

            {/* HUD Overlay */}
            <div className={`hud-container ${phase >= 1 ? 'active' : ''}`}>
                <img src="/hud-overlay-new.jpg" alt="HUD" className="hud-image" />
                <div className="vignette-overlay"></div>
                <div className="scanning-line"></div>
            </div>

            {/* Central Logo Area */}
            <div className={`logo-container ${phase >= 2 ? 'active' : ''}`}>
                <div className="hex-ring"></div>
                <div className="hex-ring reverse"></div>
                <img src="/aiesa-logo-new.jpg" alt="AIESA" className="intro-logo" />
                <div className="glitch-text">INITIALIZING SYSTEM...</div>
            </div>

            <style>{`
                .intro-container {
                    position: fixed;
                    inset: 0;
                    background: #000;
                    z-index: 2147483647 !important; /* Force on top of everything */
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    overflow: hidden;
                    transition: opacity 0.5s ease;
                }
                .intro-container.fade-out {
                    opacity: 0;
                    pointer-events: none;
                }

                /* HUD Styles */
                .hud-container {
                    position: absolute;
                    width: 100vw; /* Use viewport width */
                    height: 100vh; /* Use viewport height */
                    opacity: 0;
                    transform: scale(1.1);
                    transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .hud-container.active {
                    opacity: 1;
                    transform: scale(1);
                }
                .hud-image {
                    width: 100%;
                    height: 100%;
                    object-fit: contain !important; /* Ensure full image is visible, no cropping */
                    /* filter: drop-shadow(0 0 10px #8b5cf6); Removed glow as requested */
                }
                
                .vignette-overlay {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle, transparent 50%, #000 95%);
                    /* box-shadow: inset 0 0 100px rgba(139, 92, 246, 0.3); Removed violet glow */
                    mix-blend-mode: multiply; /* Helps blend the black cleanly */
                    pointer-events: none;
                }

                /* Logo Styles */
                .logo-container {
                    position: relative;
                    width: 40vmin;
                    height: 40vmin;
                    max-width: 400px;
                    max-height: 400px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    opacity: 0;
                    transform: scale(0.5);
                    transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .logo-container.active {
                    opacity: 1;
                    transform: scale(1);
                }
                
                .intro-logo {
                    width: 18vmin;
                    height: 18vmin;
                    max-width: 250px;
                    max-height: 250px;
                    border-radius: 50%;
                    box-shadow: 0 0 30px #06b6d4, inset 0 0 20px #06b6d4;
                    z-index: 10;
                    position: relative;
                }

                /* Sci-fi Rings */
                .hex-ring {
                    position: absolute;
                    width: 28vmin;
                    height: 28vmin;
                    max-width: 340px;
                    max-height: 340px;
                    border: 2px dashed rgba(139, 92, 246, 0.6);
                    border-radius: 50%;
                    animation: spin 10s linear infinite;
                }
                .hex-ring.reverse {
                    width: 32vmin;
                    height: 32vmin;
                    max-width: 360px;
                    max-height: 360px;
                    border: 4px dotted rgba(6, 182, 212, 0.4);
                    animation: spin 15s linear infinite reverse;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                /* Text */
                .glitch-text {
                    position: absolute;
                    bottom: -50px;
                    color: #06b6d4;
                    font-family: 'Courier New', monospace;
                    font-weight: bold;
                    letter-spacing: 4px;
                    text-shadow: 0 0 10px #06b6d4;
                    animation: blink 0.5s infinite;
                }

                /* Scanning Line */
                .scanning-line {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background: rgba(6, 182, 212, 0.5);
                    box-shadow: 0 0 10px #06b6d4;
                    animation: scan 2s linear infinite;
                }
                @keyframes scan {
                    0% { top: 0; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }

                @keyframes blink {
                    50% { opacity: 0.5; }
                }

            `}</style>
        </div>
    );
};

export default IntroAnimation;
