import axios from 'axios';
const baseURL = process.env.API_URL ? process.env.API_URL : 'https://api.greenframe.io';
const apiToken = process.env.GREENFRAME_SECRET_TOKEN;

const instance = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json', authorization: `Bearer ${apiToken}` },
});

module.exports = instance;
export default instance;
