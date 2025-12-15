// Use the deployed production API when running in production, otherwise use local backend.
// No env file required: NODE_ENV determines production vs development.
export const BACKEND_URL = process.env.NODE_ENV === 'production'
	? 'https://vapp-2.onrender.com/api'
	: 'http://localhost:8000/api';
