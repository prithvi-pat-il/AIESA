import { useEffect, useState } from 'react';
import API from '../services/api';
import CommitteeDashboard from './CommitteeDashboard'; // Reuse components if possible, or build similar

const AdminDashboard = () => {
    const [tab, setTab] = useState('members');
    const [members, setMembers] = useState<any[]>([]);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'member', post: '', insta_id: '', profile_image: null as File | null });

    useEffect(() => {
        if (tab === 'members') fetchMembers();
    }, [tab]);

    const fetchMembers = async () => {
        try { const { data } = await API.get('/users'); setMembers(data); } catch (e) { console.error(e); }
    };

    const handleCreateMember = async (e: any) => {
        e.preventDefault();
        const fd = new FormData();
        Object.keys(formData).forEach(key => {
            // @ts-ignore
            if (formData[key]) fd.append(key, formData[key]);
        });
        try {
            await API.post('/users', fd);
            alert('Member created successfully');
            fetchMembers();
            setFormData({ name: '', email: '', password: '', role: 'member', post: '', insta_id: '', profile_image: null });
        } catch (e: any) {
            console.error(e);
            alert(e.response?.data?.error || e.response?.data?.message || e.message || 'Failed to create member');
        }
    };

    const handleDeleteMember = async (id: number) => {
        if (confirm('Delete user?')) {
            await API.delete(`/users/${id}`);
            fetchMembers();
        }
    };

    const moveMember = (index: number, direction: 'up' | 'down') => {
        const newMembers = [...members];
        if (direction === 'up') {
            if (index === 0) return;
            [newMembers[index], newMembers[index - 1]] = [newMembers[index - 1], newMembers[index]];
        } else {
            if (index === members.length - 1) return;
            [newMembers[index], newMembers[index + 1]] = [newMembers[index + 1], newMembers[index]];
        }
        setMembers(newMembers);
    };

    const handleSaveOrder = async () => {
        try {
            const orderedIds = members.map(m => m.id);
            await API.post('/users/reorder', { orderedIds });
            alert('Order saved!');
        } catch (e: any) {
            console.error(e);
            alert(e.response?.data?.message || e.message || 'Failed to save order');
        }
    };

    return (
        <div className="container mt-4 fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Admin Dashboard</h2>
            </div>
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item"><button className={`nav-link ${tab === 'members' ? 'active' : ''}`} onClick={() => setTab('members')}>Manage Members</button></li>
                <li className="nav-item"><button className={`nav-link ${tab === 'committee' ? 'active' : ''}`} onClick={() => setTab('committee')}>Committee Features</button></li>
            </ul>

            <div className="card p-4 border-top-0 rounded-bottom shadow-sm">
                {tab === 'committee' && <CommitteeDashboard />}

                {tab === 'members' && (
                    <div>
                        <h4>Add New Member</h4>
                        <form onSubmit={handleCreateMember} className="mb-5 row">
                            <div className="col-md-3 mb-2"><input className="form-control" placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required /></div>
                            <div className="col-md-3 mb-2"><input className="form-control" placeholder="Email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required /></div>
                            <div className="col-md-3 mb-2"><input className="form-control" placeholder="Password" type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required /></div>
                            <div className="col-md-3 mb-2">
                                <select className="form-control" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                                    <option value="member">Member</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="col-md-3 mb-2"><input className="form-control" placeholder="Post/Role" value={formData.post} onChange={e => setFormData({ ...formData, post: e.target.value })} /></div>
                            <div className="col-md-3 mb-2"><input className="form-control" placeholder="Instagram ID" value={formData.insta_id} onChange={e => setFormData({ ...formData, insta_id: e.target.value })} /></div>
                            <div className="col-md-4 mb-2"><input className="form-control" type="file" onChange={e => setFormData({ ...formData, profile_image: e.target.files ? e.target.files[0] : null })} /></div>
                            <div className="col-md-2 mb-2"><button className="btn btn-success w-100">Add Member</button></div>
                        </form>

                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4>Existing Members</h4>
                            <button className="btn btn-primary" onClick={handleSaveOrder}>Save Order</button>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead><tr><th>Order</th><th>Name</th><th>Email</th><th>Role</th><th>Post</th><th>Action</th></tr></thead>
                                <tbody>
                                    {members.map((m, index) => (
                                        <tr key={m.id}>
                                            <td>
                                                <button className="btn btn-sm btn-light me-1" onClick={() => moveMember(index, 'up')} disabled={index === 0}>↑</button>
                                                <button className="btn btn-sm btn-light" onClick={() => moveMember(index, 'down')} disabled={index === members.length - 1}>↓</button>
                                            </td>
                                            <td>{m.name}</td>
                                            <td>{m.email}</td>
                                            <td><span className={`badge bg-${m.role === 'admin' ? 'danger' : 'info'}`}>{m.role}</span></td>
                                            <td>{m.post}</td>
                                            <td>
                                                <button className="btn btn-sm btn-danger" onClick={() => handleDeleteMember(m.id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
