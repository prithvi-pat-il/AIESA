import { useState } from 'react';

interface EventProps {
    event: {
        id: number;
        title: string;
        description: string;
        image: string;
        date?: string;
    };
    onExpandChange?: (isExpanded: boolean) => void;
}

import { getImageUrl } from '../utils/image';

const EventCard = ({ event, onExpandChange }: EventProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleReadMore = () => {
        const newExpandedState = !isExpanded;
        setIsExpanded(newExpandedState);
        if (onExpandChange) {
            onExpandChange(newExpandedState);
        }
    };

    const descriptionLimit = 100;
    const isLongDescription = event.description.length > descriptionLimit;

    return (
        <div className="card h-100 event-card border-0 shadow-sm" style={{ background: '#1e293b' }}>
            {event.image ? (
                <img
                    src={getImageUrl(event.image)}
                    className="card-img-top"
                    alt={event.title}
                    style={{ height: '200px', objectFit: 'cover' }}
                />
            ) : (
                <div className="card-img-top bg-secondary d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
                    <span className="text-white">No Image</span>
                </div>
            )}
            <div className="card-body">
                <h5 className="card-title text-white fw-bold">{event.title}</h5>
                <h6 className="card-subtitle mb-2 text-info small">{event.date}</h6>
                <p className="card-text text-light opacity-75" style={{ whiteSpace: 'pre-wrap' }}>
                    {isExpanded || !isLongDescription
                        ? event.description
                        : `${event.description.substring(0, descriptionLimit)}...`}
                    {isLongDescription && (
                        <span
                            onClick={toggleReadMore}
                            className="text-primary ms-2"
                            style={{ cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            {isExpanded ? 'Show Less' : 'Read More'}
                        </span>
                    )}
                </p>
            </div>
        </div>
    );
};

export default EventCard;
