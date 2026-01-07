import { useEffect, useState } from 'react';
import API from '../services/api';
import EventCard from '../components/EventCard';
import { Link } from 'react-router-dom';
import Antigravity from '../components/Antigravity';
import IntroAnimation from '../components/IntroAnimation';

const Home = () => {
    // Check if we've shown the intro already in this session/refresh
    const [showIntro, setShowIntro] = useState(true);
    const [events, setEvents] = useState<any[]>([]);
    const [eventName, setEventName] = useState('AIESA');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const eventsRes = await API.get('/events');
                setEvents(eventsRes.data.slice(0, 3));

                const settingsRes = await API.get('/events/main-event');
                if (settingsRes.data.main_event_name) {
                    setEventName(settingsRes.data.main_event_name);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    if (showIntro) {
        return <IntroAnimation onComplete={() => setShowIntro(false)} />;
    }

    return (
        <div className="fade-in">
            {/* Hero is fully handled by Antigravity component styles now */}
            <Antigravity eventName={eventName} count={1000} />

            <section className="mb-5 mt-5 container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold text-secondary border-start border-4 border-primary ps-3">Upcoming Events</h2>
                    <Link to="/events" className="btn btn-outline-primary rounded-pill">View More</Link>
                </div>

                <div className="row g-4">
                    {events.map(event => (
                        <div key={event.id} className="col-md-4">
                            <EventCard event={event} />
                        </div>
                    ))}
                    {events.length === 0 && (
                        <div className="col-12 text-center py-5">
                            <p className="text-muted fs-5">No events currently scheduled.</p>
                        </div>
                    )}
                </div>
            </section>

            <section className="py-5 bg-white rounded-3 shadow-sm px-4 mb-5 container">
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <h2 className="fw-bold text-primary mb-3">About AIESA</h2>
                        <p className="lead text-secondary">
                            The Artificial Intelligence Engineering Students Association (AIESA) is dedicated to fostering technical growth and community among students.
                        </p>
                        <Link to="/about" className="btn btn-primary rounded-pill px-4">Meet Our Team</Link>
                    </div>
                    <div className="col-md-6 text-center">
                        {/* Placeholder for an illustration or image */}
                        <div className="p-5 bg-light rounded-circle d-inline-block">
                            <span className="display-1 text-primary">🎓</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
