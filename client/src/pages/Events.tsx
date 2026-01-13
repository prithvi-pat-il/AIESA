import { useEffect, useState } from 'react';
import API from '../services/api';
import EventCard from '../components/EventCard';
import Loader from '../components/Loader';

const Events = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get('/events')
            .then(res => {
                setEvents(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="container mt-4 fade-in">
            <h2 className="text-center mb-5 fw-bold text-secondary">All Events</h2>
            <div className="row g-4">
                {events.map(event => (
                    <div key={event.id} className="col-md-4">
                        <EventCard event={event} />
                    </div>
                ))}
                {events.length === 0 && <p className="text-center text-muted">No events found.</p>}
            </div>
        </div>
    );
};

export default Events;

