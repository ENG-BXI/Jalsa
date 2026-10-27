import {StreamVideoClient} from '@stream-io/video-react-sdk';

if (!import.meta.env.VITE_STREAM_API_KEY) {
  throw new Error('VITE_STREAM_API_KEY is not defined in the environment variables.');
}
const client = new StreamVideoClient({apiKey: import.meta.env.VITE_STREAM_API_KEY});

export default client;
