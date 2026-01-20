import { useEffect, useState } from 'react';
import API from '../services/api';
import EventCard from '../components/EventCard';
import Loader from '../components/Loader';

const Events = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentEventIndex, setCurrentEventIndex] = useState(0);

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

    // Auto-play effect
    useEffect(() => {
        if (events.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentEventIndex((prevIndex) => (prevIndex + 1) % events.length);
        }, 5000); // Change every 5 seconds

        return () => clearInterval(interval);
    }, [events.length]);

    const nextEvent = () => {
        setCurrentEventIndex((prevIndex) => (prevIndex + 1) % events.length);
    };

    const prevEvent = () => {
        setCurrentEventIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length);
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="container mt-4 fade-in">
            <h2 className="text-center mb-5 fw-bold text-secondary">All Events</h2>

            {events.length > 0 ? (
                <div className="d-flex align-items-center justify-content-center position-relative">
                    {/* Left Arrow */}
                    <button
                        onClick={prevEvent}
                        className="btn btn-dark position-absolute start-0 translate-middle-y rounded-circle d-none d-md-flex align-items-center justify-content-center shadow"
                        style={{ top: '50%', width: '50px', height: '50px', zIndex: 10, border: '2px solid rgba(255,255,255,0.1)' }}
                        aria-label="Previous Event"
                    >
                        <span className="fs-4 text-white">&#10094;</span>
                    </button>

                    <div className="col-md-8 col-lg-6 mx-auto">
                        <div key={events[currentEventIndex].id} className="fade-in">
                            <EventCard event={events[currentEventIndex]} />
                        </div>
                    </div>

                    {/* Right Arrow */}
                    <button
                        onClick={nextEvent}
                        className="btn btn-dark position-absolute end-0 translate-middle-y rounded-circle d-none d-md-flex align-items-center justify-content-center shadow"
                        style={{ top: '50%', width: '50px', height: '50px', zIndex: 10, border: '2px solid rgba(255,255,255,0.1)' }}
                        aria-label="Next Event"
                    >
                        <span className="fs-4 text-white">&#10095;</span>
                    </button>

                    {/* Mobile Navigation (below card) */}
                    <div className="d-flex d-md-none justify-content-center gap-3 mt-3 w-100 position-absolute" style={{ bottom: '-60px' }}>
                        <button onClick={prevEvent} className="btn btn-dark rounded-circle shadow" style={{ width: '45px', height: '45px' }}>
                            <span className="fs-5 text-white">&#10094;</span>
                        </button>
                        <button onClick={nextEvent} className="btn btn-dark rounded-circle shadow" style={{ width: '45px', height: '45px' }}>
                            <span className="fs-5 text-white">&#10095;</span>
                        </button>
                    </div>
                </div>
            ) : (
                <p className="text-center text-muted">No events found.</p>
            )}

            {/* Spacer for mobile nav */}
            <div className="d-block d-md-none" style={{ height: '80px' }}></div>
        </div>
    );
};

export default Events;

