import { useEffect, useState } from 'react';
import api from '../services/api';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    post: string;
    insta_id?: string;
    profile_image?: string;
}

const Members = () => {
    const [members, setMembers] = useState<User[]>([]);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const res = await api.get('/users');
                const committeeMembers = res.data.filter((user: User) => user.role !== 'admin');
                setMembers(committeeMembers);
            } catch (err) {
                console.error("Failed to fetch members", err);
            }
        };
        fetchMembers();
    }, []);

    return (
        <div className="container mt-5 fade-in">
            <h1 className="text-center mb-5 display-4 fw-bold" style={{ color: '#8b5cf6', textShadow: '0 0 20px rgba(139, 92, 246, 0.5)' }}>Committee Members</h1>
            <div className="row g-4 justify-content-center">
                {members.map(member => (
                    <div key={member.id} className="col-md-4 col-lg-3">
                        <div className="member-card-wrapper h-100 glow-card" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                            <div className="card h-100 text-center p-2" style={{ background: '#0f172a', border: 'none', height: '400px' }}>
                                <div className="member-image-container mb-3" style={{ height: '250px', borderRadius: '15px', overflow: 'hidden', position: 'relative' }}>
                                    <img
                                        src={member.profile_image ? `http://localhost:5000${member.profile_image}` : "https://via.placeholder.com/300x400"}
                                        alt={member.name}
                                        className="w-100 h-100"
                                        style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                    />
                                    <div className="hover-overlay" style={{
                                        position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                                        opacity: 0, transition: 'opacity 0.3s'
                                    }}></div>
                                </div>
                                <div className="card-body d-flex flex-column justify-content-center">
                                    <h4 className="card-title fw-bold mb-1 text-white">{member.name}</h4>
                                    <p className="card-text text-light mb-2 opacity-75">{member.post}</p>

                                    {member.insta_id && (
                                        <div className="mt-auto pt-2">
                                            <a href={`https://instagram.com/${member.insta_id}`} target="_blank" rel="noopener noreferrer"
                                                className="text-white text-decoration-none d-inline-flex align-items-center gap-2 social-link">
                                                <i className="bi bi-instagram"></i>
                                                <span style={{ borderBottom: '1px solid transparent' }}>Instagram</span>
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <style>{`
                .member-card-wrapper:hover img {
                    transform: scale(1.1);
                }
                .member-card-wrapper:hover .hover-overlay {
                    opacity: 1;
                }
                .social-link:hover span {
                    border-bottom-color: white !important;
                }
            `}</style>
        </div>
    );
};

export default Members;
