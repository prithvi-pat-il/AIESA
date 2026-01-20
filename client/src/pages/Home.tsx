import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    const [direction, setDirection] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

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
        if (events.length <= 1 || isPaused) return;

        const interval = setInterval(() => {
            setDirection(1);
            setCurrentEventIndex((prevIndex) => (prevIndex + 1) % events.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [events.length, isPaused]);

    const nextEvent = () => {
        setDirection(1);
        setCurrentEventIndex((prevIndex) => (prevIndex + 1) % events.length);
    };

    const prevEvent = () => {
        setDirection(-1);
        setCurrentEventIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length);
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    const handleExpandChange = (expanded: boolean) => {
        setIsPaused(expanded);
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
            scale: 0.8,
            zIndex: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 }
            }
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 300 : -300,
            opacity: 0,
            scale: 0.8,
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 }
            }
        })
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

                            <div className="col-md-8 col-lg-6 mx-auto position-relative">
                                <AnimatePresence initial={false} custom={direction} mode="wait">
                                    <motion.div
                                        key={events[currentEventIndex].id}
                                        custom={direction}
                                        variants={variants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        className="w-100"
                                        style={{
                                            perspective: '1000px',
                                            cursor: 'grab'
                                        }}
                                        drag="x"
                                        dragConstraints={{ left: 0, right: 0 }}
                                        dragElastic={1}
                                        onDragEnd={(e, { offset, velocity }) => {
                                            const swipe = swipePower(offset.x, velocity.x);

                                            if (swipe < -swipeConfidenceThreshold) {
                                                nextEvent();
                                            } else if (swipe > swipeConfidenceThreshold) {
                                                prevEvent();
                                            }
                                        }}
                                    >
                                        <EventCard
                                            event={events[currentEventIndex]}
                                            onExpandChange={handleExpandChange}
                                        />
                                    </motion.div>
                                </AnimatePresence>

                                {/* Mobile Navigation (relative, below card) */}
                                <div className="d-flex d-md-none justify-content-center gap-3 mt-3 w-100">
                                    <button onClick={prevEvent} className="btn btn-dark rounded-circle shadow" style={{ width: '45px', height: '45px' }}>
                                        <span className="fs-5 text-white">&#10094;</span>
                                    </button>
                                    <button onClick={nextEvent} className="btn btn-dark rounded-circle shadow" style={{ width: '45px', height: '45px' }}>
                                        <span className="fs-5 text-white">&#10095;</span>
                                    </button>
                                </div>
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
