if (!import.meta.env.VITE_BACKEND_URL) throw new Error('VITE_BACKEND_URL Must Be inside env');

export const env = {
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
  APPWRITE_API_KEY: import.meta.env.VITE_APPWRITE_API_KEY,
  APPWRITE_API_ENDPOINT: import.meta.env.VITE_APPWRITE_API_ENDPOINT,
  APPWRITE_PROJECT_ID: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  APPWRITE_IMAGE_BUCKET_ID: import.meta.env.VITE_APPWRITE_IMAGE_BUCKET_ID
};


export const APPWRITE_BUCKETS_IDS = {
  image: env.APPWRITE_IMAGE_BUCKET_ID
};
