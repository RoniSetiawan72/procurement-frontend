import api from '../axios';

export const getPurchaseReq = async (search = '') => {
  try {
    const response = await api.get(`/purchase-requisitions?search=${search}`);
    return response.data.data || response.data.data;
  } catch (error) {
    console.error("Gagal mengambil data Purchase Requisition:", error);
    throw error;
  }
};

export const createPurchaseReq = async (data) => {
  try {
    const response = await api.post('/purchase-requisitions', data);
    return response.data;
  } catch (error) {
    console.error("Axios error:", error);
    if (error.response) {
      console.error('Response Data:', error.response.data);
      console.error('Response Status:', error.response.status);
    }
    throw error.response?.data?.message || "Gagal membuat purchase requisition.";
  }
};

export const updatePurchaseReq = async (id, data) => {
  try {
    const response = await api.put(`/purchase-requisitions/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Gagal memperbarui purchase requisition.";
  }
};

export const submitPurchaseReq =  async (id) => {
  const response = await api.patch(`/purchase-requisitions/${id}/submit`);
};

export const approvePurchaseReq = async (id) => {
  const response = await api.patch(`/purchase-requisitions/${id}/approve`);
}