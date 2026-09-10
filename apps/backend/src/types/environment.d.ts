declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      DATABASE_URL: string;
      NODE_ENV: 'development' | 'production';
    }
  }
}

// If this file has no imports/exports, force it to be parsed as a module.
export {};
