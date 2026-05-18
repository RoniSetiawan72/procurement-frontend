import api from '../axios';

export const getTenders = async (search = '') => {
  try {
    const response = await api.get(`/tenders?search=${search}`);
    return response.data.data.data || response.data.data;
  } catch (error) {
    console.error("Gagal mengambil data Tenders:", error);
    throw error;
  }
};

export const createTender = async (data) => {
  try {
    const response = await api.post('/tenders', data);
    return response.data;
  } catch (error) {
    console.error("Axios error:", error);
    if (error.response) {
      console.error('Response Data:', error.response.data);
      console.error('Response Status:', error.response.status);
    }
    throw error.response?.data?.message || "Gagal membuat tender.";
  }
};

export const updateTender = async (id, data) => {
  try {
    const response = await api.put(`/tenders/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Gagal memperbarui Tender.";
  }
}
