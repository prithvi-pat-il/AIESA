import React from 'react';

const Loader = () => {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
            <div className="cyber-loader mb-4">
                <div className="inner-ring"></div>
            </div>
            <h2 className="text-secondary fw-bold fade-in-text">Wait a second...</h2>
            <style>{`
                .cyber-loader {
                    width: 80px;
                    height: 80px;
                    border: 4px solid rgba(139, 92, 246, 0.2);
                    border-top: 4px solid #8b5cf6;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    position: relative;
                    box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
                }
                .inner-ring {
                    position: absolute;
                    inset: 10px;
                    border: 4px solid rgba(6, 182, 212, 0.2);
                    border-bottom: 4px solid #06b6d4;
                    border-radius: 50%;
                    animation: spin 1.5s linear infinite reverse;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .fade-in-text {
                    animation: fadeIn 1s ease-in-out infinite alternate;
                }
                @keyframes fadeIn {
                    from { opacity: 0.5; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default Loader;
