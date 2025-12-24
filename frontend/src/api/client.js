// src/api/client.js
import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:5050',   // ✅ backend port
});

export default client;