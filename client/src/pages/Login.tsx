import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await login({ email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            if (data.user.role === 'admin') navigate('/admin');
            else navigate('/dashboard');
            window.location.reload(); // To update Navbar state
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="container mt-5 fade-in">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="glow-card" style={{ borderRadius: '20px' }}>
                        <div className="card p-4 shadow-lg border-0 rounded-4" style={{ background: '#0f172a' }}>
                            <h2 className="text-center mb-4 fw-bold" style={{ color: '#06b6d4' }}>Login</h2>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label text-light">Email</label>
                                    <input
                                        type="email"
                                        className="form-control rounded-pill bg-dark text-light border-secondary"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-light">Password</label>
                                    <input
                                        type="password"
                                        className="form-control rounded-pill bg-dark text-light border-secondary"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100 rounded-pill fw-bold" style={{ background: '#06b6d4', border: 'none' }}>Login</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
