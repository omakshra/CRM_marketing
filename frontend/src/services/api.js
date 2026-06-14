import axios from 'axios';
import { API_BASE_URL } from '../config';
import { getApiErrorMessage } from '../utils/apiError';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 120000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    error.userMessage = getApiErrorMessage(error);
    return Promise.reject(error);
  },
);

async function unwrap(request, fallbackMessage) {
  try {
    const response = await request();
    return { data: response.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error.userMessage ?? getApiErrorMessage(error, fallbackMessage),
    };
  }
}

export const getCustomers = () => api.get('/customers');
export const createSegment = (query) => api.post('/segment', { query });
export const getCampaigns = () => api.get('/campaigns');
export const createCampaign = (payload) => api.post('/campaigns', payload);
export const sendCampaign = (campaignId) => api.post(`/campaigns/${campaignId}/send`);
export const getAnalytics = () => api.get('/analytics');
export const getCampaignAnalytics = (campaignId) => api.get(`/campaigns/${campaignId}/analytics`);

export const fetchCustomers = () => unwrap(() => getCustomers(), 'Failed to load customers.');
export const fetchCampaigns = () => unwrap(() => getCampaigns(), 'Failed to load campaigns.');
export const fetchAnalytics = () => unwrap(() => getAnalytics(), 'Failed to load analytics.');
export const fetchSegment = (query) =>
  unwrap(() => createSegment(query), 'Failed to create segment. Is the backend running?');
export const submitCampaign = (payload) =>
  unwrap(() => createCampaign(payload), 'Failed to create campaign.');
export const submitCampaignSend = (campaignId) =>
  unwrap(() => sendCampaign(campaignId), 'Failed to send campaign.');

export { getApiErrorMessage };
export default api;
