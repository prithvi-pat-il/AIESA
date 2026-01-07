import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser } from '../services/auth';

interface Props {
    roles?: string[];
}

const ProtectedRoute = ({ roles }: Props) => {
    const user = getCurrentUser();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
