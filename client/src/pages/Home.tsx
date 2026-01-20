import { useEffect, useState } from 'react';
import API from '../services/api';
import EventCard from '../components/EventCard';
import { Link } from 'react-router-dom';
import Antigravity from '../components/Antigravity';
import IntroAnimation from '../components/IntroAnimation';
import Loader from '../components/Loader';

const Home = () => {
    // Check if we've shown the intro already in this session/refresh
    const [showIntro, setShowIntro] = useState(true);
    const [events, setEvents] = useState<any[]>([]);
    const [eventName, setEventName] = useState('AIESA');
    const [loadingEvents, setLoadingEvents] = useState(true);

    const [currentEventIndex, setCurrentEventIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // setLoadingEvents(true); // Already true by default
                const eventsRes = await API.get('/events');
                setEvents(eventsRes.data.slice(0, 5)); // Increase slice to 5 for carousel
                setLoadingEvents(false);

                const settingsRes = await API.get('/events/main-event');
                if (settingsRes.data.main_event_name) {
                    setEventName(settingsRes.data.main_event_name);
                }
            } catch (err) {
                console.error(err);
                setLoadingEvents(false);
            }
        };
        fetchData();
    }, []);

    // Auto-play effect for Home Carousel
    useEffect(() => {
        if (events.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentEventIndex((prevIndex) => (prevIndex + 1) % events.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [events.length]);

    const nextEvent = () => {
        setCurrentEventIndex((prevIndex) => (prevIndex + 1) % events.length);
    };

    const prevEvent = () => {
        setCurrentEventIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length);
    };

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

                {loadingEvents ? (
                    <Loader />
                ) : (
                    events.length > 0 ? (
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

                            {/* Spacer for mobile nav */}
                            <div className="d-block d-md-none" style={{ height: '60px' }}></div>
                        </div>
                    ) : (
                        <div className="col-12 text-center py-5">
                            <p className="text-muted fs-5">No events currently scheduled.</p>
                        </div>
                    )
                )}
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
