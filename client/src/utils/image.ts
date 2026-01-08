export const getImageUrl = (path: string | undefined): string => {
    if (!path) return '';
    if (path.startsWith('http')) {
        return path;
    }
    // Fallback for legacy relative paths (backward compatibility)
    return `https://aiesa-frontend.onrender.com${path}`;
};
