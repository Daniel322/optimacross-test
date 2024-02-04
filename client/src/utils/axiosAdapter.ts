import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const AXIOS_TIMEOUT = 2e4;

const axiosAdapter = axios.create({
  baseURL: `${process.env.API_URL}/api`,
  timeout: AXIOS_TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});


export default axiosAdapter;
