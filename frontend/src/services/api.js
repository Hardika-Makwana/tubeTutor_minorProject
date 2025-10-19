import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

export const getVideos = () => API.get('/videos');
export const getTranscript = (videoName) => API.get(`/video/${videoName}`);
export const uploadVideo = (formData) => API.post('/upload_video/', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});