import axios from 'axios';
import NProgress from 'nprogress';

// Create a new Axios instance
const api = axios.create({
    // We can set the base URL here if we want, but it's already in our env
    // baseURL: process.env.NEXT_PUBLIC_API_URL, 
});

// --- Request Interceptor ---
// This runs BEFORE any request is sent
api.interceptors.request.use(
    (config) => {
        // Start the loading bar
        NProgress.start();
        return config;
    },
    (error) => {
        // If there's an error in the request setup, stop the loading bar
        NProgress.done();
        return Promise.reject(error);
    }
);

// --- Response Interceptor ---
// This runs AFTER a response is received
api.interceptors.response.use(
    (response) => {
        // Stop the loading bar on a successful response
        NProgress.done();
        return response;
    },
    (error) => {
        // Stop the loading bar on a failed response
        NProgress.done();
        return Promise.reject(error);
    }
);

export default api;