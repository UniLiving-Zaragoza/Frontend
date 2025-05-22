// src/socket.js
import { io } from 'socket.io-client';

const API_URL = 'https://uniliving-backend.onrender.com';
const socket = io(API_URL, { autoConnect: false });

export default socket;
