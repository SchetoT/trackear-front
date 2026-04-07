import axios from 'axios';

const API_BASE_URL = `${import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:5000'}/api/tracking`;

export const getTrackingInfo = async (
  empresa: string,
  trackingNumber: string,
  extraParams: Record<string, string> = {}
) => {
  const response = await axios.get(`${API_BASE_URL}/${empresa}/${encodeURIComponent(trackingNumber)}`, {
    params: extraParams
  });

  return response.data;
};