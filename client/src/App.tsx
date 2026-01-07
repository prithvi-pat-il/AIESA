import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GooeyNavbar from './components/GooeyNavbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Events from './pages/Events';
import Members from './pages/Members';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import CommitteeDashboard from './pages/CommitteeDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <GooeyNavbar />
      <GooeyNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<Members />} />
        <Route path="/events" element={<Events />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute roles={['member', 'admin']} />}>
          <Route path="/dashboard" element={<CommitteeDashboard />} />
        </Route>

        <Route element={<ProtectedRoute roles={['admin']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
