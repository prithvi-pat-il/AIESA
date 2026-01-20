import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../services/api';
import EventCard from '../components/EventCard';
import Loader from '../components/Loader';

const Events = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentEventIndex, setCurrentEventIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

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
        if (events.length <= 1 || isPaused) return;

        const interval = setInterval(() => {
            setDirection(1);
            setCurrentEventIndex((prevIndex) => (prevIndex + 1) % events.length);
        }, 5000); // Change every 5 seconds

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
                x: { stiffness: 300, damping: 30 },
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
                x: { stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 }
            }
        })
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="container mt-4 fade-in" style={{ overflow: 'hidden', minHeight: '600px' }}>
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
                                onDragEnd={(_, { offset, velocity }) => {
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

