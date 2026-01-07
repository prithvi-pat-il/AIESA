import ElectricBorder from '../components/ElectricBorder';

const Contact = () => {
    return (
        <div className="container mt-4 fade-in">
            <h1 className="text-center mb-5 display-4 fw-bold" style={{ color: '#8b5cf6', textShadow: '0 0 20px rgba(139, 92, 246, 0.5)' }}>Contact Us</h1>
            <div className="row justify-content-center">
                <div className="col-md-6 mb-4 mb-md-0">
                    <ElectricBorder color="#a78bfa" speed={1.5} chaos={0.2} borderRadius={20}>
                        <div className="card p-4 shadow-lg border-0 rounded-4 h-100" style={{ background: '#0f172a' }}>
                            <form>
                                <div className="mb-3">
                                    <label className="form-label text-light">Name</label>
                                    <input type="text" className="form-control rounded-pill bg-dark text-light border-secondary" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-light">Email</label>
                                    <input type="email" className="form-control rounded-pill bg-dark text-light border-secondary" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-light">Message</label>
                                    <textarea className="form-control rounded-4 bg-dark text-light border-secondary" rows={5}></textarea>
                                </div>
                                <button className="btn btn-primary w-100 rounded-pill fw-bold" style={{ background: '#8b5cf6', border: 'none' }}>Send Message</button>
                            </form>
                        </div>
                    </ElectricBorder>
                </div>
                <div className="col-md-5 offset-md-1 d-flex flex-column justify-content-center text-white">
                    <div className="mb-5">
                        <h4 className="fw-bold text-primary mb-3">Visit Us</h4>
                        <p className="lead opacity-75">AIESA Office, AI&DS Department, SIT</p>
                    </div>

                    <div>
                        <h4 className="fw-bold text-primary mb-3">Follow Us</h4>
                        <div className="d-flex gap-4">
                            <a href="https://www.instagram.com/aiesa_sit/" target="_blank" rel="noopener noreferrer" className="text-white text-decoration-none d-flex align-items-center gap-2 social-link">
                                <i className="bi bi-instagram fs-4" style={{ color: '#E1306C' }}></i>
                                <span className="fs-5">Instagram</span>
                            </a>
                            <a href="https://www.linkedin.com/school/sitcoe/?originalSubdomain=in" target="_blank" rel="noopener noreferrer" className="text-white text-decoration-none d-flex align-items-center gap-2 social-link">
                                <i className="bi bi-linkedin fs-4" style={{ color: '#0077b5' }}></i>
                                <span className="fs-5">LinkedIn</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                .social-link:hover {
                    opacity: 0.8;
                    transform: translateX(5px);
                    transition: all 0.3s ease;
                }
            `}</style>
        </div>
    );
};
export default Contact;
