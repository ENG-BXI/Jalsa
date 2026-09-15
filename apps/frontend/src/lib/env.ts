if (!import.meta.env.VITE_BACKEND_URL) throw new Error('VITE_BACKEND_URL Must Be inside env');
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
