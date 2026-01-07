import { useEffect, useState } from 'react';
import API from '../services/api';
import { getCurrentUser } from '../services/auth';

const CommitteeDashboard = () => {
    const user = getCurrentUser();
    const [tab, setTab] = useState('events');

    // Events Data
    const [events, setEvents] = useState<any[]>([]);
    const [mainEventName, setMainEventName] = useState('');

    useEffect(() => {
        fetchEvents();
        fetchMainEvent();
    }, []);

    const fetchEvents = async () => {
        try { const { data } = await API.get('/events'); setEvents(data); } catch (e) { console.error(e); }
    };
    const fetchMainEvent = async () => {
        try { const { data } = await API.get('/events/main-event'); if (data.main_event_name) setMainEventName(data.main_event_name); } catch (e) { console.error(e); }
    };

    return (
        <div className="container mt-4 fade-in">
            <h2 className="mb-4">Committee Dashboard</h2>
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button className={`nav-link ${tab === 'events' ? 'active' : ''}`} onClick={() => setTab('events')}>Manage Events</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>My Profile</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${tab === 'settings' ? 'active' : ''}`} onClick={() => setTab('settings')}>Main Settings</button>
                </li>
            </ul>

            <div className="tab-content card p-4 border-top-0 rounded-bottom shadow-sm">
                {tab === 'events' && <EventsTab events={events} refresh={fetchEvents} />}
                {tab === 'profile' && <ProfileTab user={user} />}
                {tab === 'settings' && <SettingsTab currentName={mainEventName} refresh={fetchMainEvent} />}
            </div>
        </div>
    );
};

const EventsTab = ({ events, refresh }: any) => {
    const [formData, setFormData] = useState({ title: '', description: '', date: '', image: null as File | null });
    const [editingId, setEditingId] = useState<number | null>(null);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('date', formData.date);
        if (formData.image) data.append('image', formData.image);

        try {
            if (editingId) await API.put(`/events/${editingId}`, data);
            else await API.post('/events', data);
            setFormData({ title: '', description: '', date: '', image: null });
            setEditingId(null);
            refresh();
        } catch (err) { alert('Operation failed'); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure?')) return;
        await API.delete(`/events/${id}`);
        refresh();
    };

    const handleEdit = (event: any) => {
        setFormData({ title: event.title, description: event.description, date: event.date || '', image: null });
        setEditingId(event.id);
    };

    return (
        <div>
            <h4>{editingId ? 'Edit Event' : 'Add New Event'}</h4>
            <form onSubmit={handleSubmit} className="mb-5">
                <div className="row">
                    <div className="col-md-4 mb-2"><input className="form-control" placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required /></div>
                    <div className="col-md-3 mb-2"><input className="form-control" type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} /></div>
                    <div className="col-md-5 mb-2"><input className="form-control" type="file" onChange={e => setFormData({ ...formData, image: e.target.files ? e.target.files[0] : null })} /></div>
                    <div className="col-12 mb-2"><textarea className="form-control" placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} /></div>
                    <div className="col-12"><button type="submit" className="btn btn-success me-2">{editingId ? 'Update' : 'Add'} Event</button> {editingId && <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(null); setFormData({ title: '', description: '', date: '', image: null }); }}>Cancel</button>}</div>
                </div>
            </form>
            <h4>All Events</h4>
            <div className="list-group">
                {events.map((ev: any) => (
                    <div key={ev.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div><strong>{ev.title}</strong> <small className="text-muted">({ev.date})</small></div>
                        <div>
                            <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(ev)}>Edit</button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(ev.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ProfileTab = ({ user }: any) => {
    const [data, setData] = useState({ name: user.name, email: user.email, insta_id: user.insta_id || '', post: user.post || '', password: '', image: null as File | null });

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append('name', data.name);
        fd.append('email', data.email);
        fd.append('insta_id', data.insta_id);
        fd.append('post', data.post);
        if (data.password) fd.append('password', data.password);
        if (data.image) fd.append('profile_image', data.image);

        try {
            const res = await API.put(`/users/${user.id}`, fd);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            alert('Profile updated! Please refresh to see changes.');
        } catch (err) { alert('Update failed'); }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="row">
                <div className="col-md-6 mb-3"><label>Name</label><input className="form-control" value={data.name} onChange={e => setData({ ...data, name: e.target.value })} /></div>
                <div className="col-md-6 mb-3"><label>Email</label><input className="form-control" value={data.email} onChange={e => setData({ ...data, email: e.target.value })} /></div>
                <div className="col-md-6 mb-3"><label>Instagram ID</label><input className="form-control" value={data.insta_id} onChange={e => setData({ ...data, insta_id: e.target.value })} /></div>
                <div className="col-md-6 mb-3"><label>Post/Role</label><input className="form-control" value={data.post} onChange={e => setData({ ...data, post: e.target.value })} /></div>
                <div className="col-md-6 mb-3"><label>New Password (leave blank to keep)</label><input className="form-control" type="password" value={data.password} onChange={e => setData({ ...data, password: e.target.value })} /></div>
                <div className="col-md-6 mb-3"><label>Profile Image</label><input className="form-control" type="file" onChange={e => setData({ ...data, image: e.target.files ? e.target.files[0] : null })} /></div>
                <div className="col-12"><button className="btn btn-primary">Update Profile</button></div>
            </div>
        </form>
    );
};

const SettingsTab = ({ currentName, refresh }: any) => {
    const [name, setName] = useState(currentName);

    useEffect(() => {
        setName(currentName);
    }, [currentName]);

    const handleUpdate = async () => {
        try {
            await API.put('/events/main-event', { main_event_name: name });
            refresh();
            alert('Updated!');
        } catch (err: any) {
            console.error('Update failed:', err);
            alert(err.response?.data?.message || err.message || 'Failed');
        }
    };

    return (
        <div>
            <div className="mb-3">
                <label className="form-label">Main Event Name</label>
                <input className="form-control" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <button className="btn btn-primary" onClick={handleUpdate}>Update Event Name</button>
        </div>
    );
};

export default CommitteeDashboard;
