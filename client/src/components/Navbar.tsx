import { Link, useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../services/auth';

const Navbar = () => {
    const user = getCurrentUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
            <div className="container">
                <Link className="navbar-brand text-primary fw-bold fs-4" to="/">AIESA</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center">
                        <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/about">About Us</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/events">Events</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/contact">Contact</Link></li>

                        {!user ? (
                            <li className="nav-item ms-lg-3"><Link className="btn btn-primary btn-sm px-4 rounded-pill" to="/login">Login</Link></li>
                        ) : (
                            <>
                                <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
                                {user.role === 'admin' && (
                                    <li className="nav-item"><Link className="nav-link" to="/admin">Admin</Link></li>
                                )}
                                <li className="nav-item ms-2">
                                    <button className="btn btn-outline-light btn-sm rounded-pill" onClick={handleLogout}>Logout</button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
