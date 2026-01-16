export const getImageUrl = (path: string | undefined): string => {
    if (!path) return '';
    // Check for Cloudinary URL and apply optimizations
    if (path.includes('cloudinary.com') && !path.includes('/f_auto,q_auto')) {
        // Insert optimization params after /upload/
        return path.replace('/upload/', '/upload/f_auto,q_auto/');
    }

    if (path.startsWith('http')) {
        return path;
    }
    // Fallback for legacy relative paths (backward compatibility)
    return `https://aiesa-frontend.onrender.com${path}`;
};
