import { useState } from 'react';
import API from '../services/api';

const SetupAdmin = () => {
    const [status, setStatus] = useState<string>('Ready to setup');
    const [loading, setLoading] = useState(false);

    const handleSetup = async () => {
        setLoading(true);
        try {
            const res = await API.get('/auth/setup-admin');
            setStatus(JSON.stringify(res.data, null, 2));
        } catch (err: any) {
            setStatus('Error: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5 pt-5 text-center text-white">
            <h1>Admin Setup Tool</h1>
            <p>Click below to attempt creating the Default Admin user.</p>
            <button
                onClick={handleSetup}
                disabled={loading}
                className="btn btn-primary d-block mx-auto my-4"
            >
                {loading ? 'Processing...' : 'Create Admin User'}
            </button>
            <pre className="bg-dark p-3 rounded text-start d-inline-block">
                {status}
            </pre>
            <div className="mt-4">
                <p>After success, try logging in with:</p>
                <ul className="list-unstyled">
                    <li>Email: <strong>admin@aiesa.com</strong></li>
                    <li>Password: <strong>admin123</strong></li>
                </ul>
            </div>
        </div>
    );
};

export default SetupAdmin;
