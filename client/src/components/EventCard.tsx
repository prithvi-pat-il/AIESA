interface EventProps {
    event: {
        id: number;
        title: string;
        description: string;
        image: string;
        date?: string;
    };
}

const EventCard = ({ event }: EventProps) => {
    return (
        <div className="card h-100 event-card border-0 shadow-sm" style={{ background: '#1e293b' }}>
            {event.image ? (
                <img
                    src={`https://aiesa-frontend.onrender.com${event.image}`}
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
                <p className="card-text text-light opacity-75">{event.description.length > 100 ? event.description.substring(0, 100) + '...' : event.description}</p>
            </div>
        </div>
    );
};

export default EventCard;
