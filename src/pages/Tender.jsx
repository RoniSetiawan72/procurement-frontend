import React, { useState, useEffect } from 'react';
import { Plus, Edit, Eye, Trash2, X, Calendar, FileText, Save } from 'lucide-react';
import Swal from 'sweetalert2';
import { getTenders, createTender, updateTender } from '../api/services/tenderService';
import { getPurchaseReq } from '../api/services/purchaseReqService';

const Tender = () => {
  const [tenders, setTenders] = useState([]);
  const [purchaseRequisitions, setPurchaseRequisitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedTender, setSelectedTender] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [btnLoading, setBtnLoading] = useState(false);

  const [formData, setFormData] = useState({
    purchase_requisition_id: '',
    title: '',
    description: '',
    start_date: '',
    end_date: ''
  });

  const fetchTendersData = async () => {
    try {
      setLoading(true);
      const data = await getTenders(searchTerm);
      setTenders(data);
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'ERROR!',
        text: 'Gagal mengambil data dari server database.',
        icon: 'error',
        confirmButtonColor: '#000'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPRReferences = async () => {
    try {
      const data = await getPurchaseReq();
      const approvedPRs = data.filter(pr => pr.status === 'submitted' || pr.status === 'approved' || pr.status === 'draft');
      setPurchaseRequisitions(approvedPRs);
    } catch (error) {
      console.error("Gagal mengambil referensi PR:", error);
    }
  };

  useEffect(() => {
    fetchTendersData();
  }, [searchTerm]);

  useEffect(() => {
    fetchPRReferences();
  }, []);

  const openModal = (mode, tender = null) => {
    setModalMode(mode);
    if (mode === 'update' && tender) {
      setSelectedTender(tender);
      const formatToInputDate = (dateStr) => dateStr ? dateStr.replace(' ', 'T').substring(0, 16) : '';
      
      setFormData({
        purchase_requisition_id: tender.purchase_requisition_id,
        title: tender.title,
        description: tender.description,
        start_date: formatToInputDate(tender.start_date),
        end_date: formatToInputDate(tender.end_date)
      });
    } else {
      setSelectedTender(null);
      setFormData({
        purchase_requisition_id: '',
        title: '',
        description: '',
        start_date: '',
        end_date: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTender(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formatToBackendDate = (dateTimeStr) => dateTimeStr ? dateTimeStr.replace('T', ' ') + ':00' : '';
    
    const payload = {
      purchase_requisition_id: Number(formData.purchase_requisition_id),
      title: formData.title,
      description: formData.description,
      start_date: formatToBackendDate(formData.start_date),
      end_date: formatToBackendDate(formData.end_date)
    };

    try {
      if (modalMode === 'create') {
        await createTender(payload);
        console.log("Create Payload:", payload);
      } else {
        await updateTender(selectedTender.id, payload);
        console.log("Update Payload:", payload);
      }

      closeModal();
      fetchTendersData();
      
      Swal.fire({
        title: 'BERHASIL!',
        text: `Data tender berhasil ${modalMode === 'create' ? 'dibuat' : 'diperbarui'}.`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        background: '#fff',
        customClass: { popup: 'border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]' }
      });
    } catch (error) {
      Swal.fire('ERROR', 'Gagal menyimpan data tender.', 'error');
    }
  };

  return (
    <div className="w-full pb-10">
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">Tender Procurement</h1>
          <p className="text-gray-600 font-bold">Kelola pembukaan lelang pengadaan barang dan jasa.</p>
        </div>
        <button 
          onClick={() => openModal('create')}
          className="flex items-center gap-2 border-4 border-black bg-neo-blue px-6 py-3 font-black uppercase tracking-tight shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
        >
          <Plus size={20} /> Buat Tender Baru
        </button>
      </div>

      {/* Search Bar Container */}
      <div className="bg-white border-4 border-black p-4 mb-6 shadow-neo flex justify-between items-center">
        <input 
          type="text" 
          placeholder="CARI JUDUL TENDER ATAU NO DOKUMEN..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-xl border-4 border-black p-2 font-bold focus:outline-none focus:bg-neo-yellow transition-colors uppercase text-sm"
        />
        <div className="font-black uppercase text-sm hidden md:block">
          Total Data: <span className="text-neo-red">{tenders.length}</span>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white border-4 border-black shadow-neo overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neo-yellow border-b-4 border-black text-sm font-black uppercase">
              <th className="p-4 border-r-2 border-black">No. PR Referensi</th>
              <th className="p-4 border-r-2 border-black">Judul Lelang / Tender</th>
              <th className="p-4 border-r-2 border-black">Tanggal Mulai</th>
              <th className="p-4 border-r-2 border-black">Tanggal Selesai</th>
              <th className="p-4 border-r-2 border-black text-center">Status</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black font-bold text-sm">
            {loading ? (
              <tr>
                <td colSpan="6" className="p-10 text-center font-black uppercase text-neo-blue italic animate-pulse">
                  MENGAMBIL DATA DARI DATABASE...
                </td>
              </tr>
            ) : tenders.length > 0 ? (
              tenders.map((tender) => (
                <tr key={tender.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 border-r-2 border-black uppercase font-black">
                    {tender.pr_number || `ID PR: ${tender.purchase_requisition_id}`}
                  </td>
                  <td className="p-4 border-r-2 border-black">
                    <div className="uppercase font-black">{tender.title}</div>
                    <div className="text-xs text-gray-500 italic font-medium line-clamp-1">{tender.description}</div>
                  </td>
                  <td className="p-4 border-r-2 border-black text-xs">{tender.start_date}</td>
                  <td className="p-4 border-r-2 border-black text-xs">{tender.end_date}</td>
                  <td className="p-4 border-r-2 border-black text-center">
                    <span className="px-3 py-1 border-2 border-black bg-neo-green font-black uppercase text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      {tender.status || 'active'}
                    </span>
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    <button 
                      onClick={() => openModal('update', tender)}
                      className="p-2 border-2 border-black bg-white hover:bg-neo-yellow transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                      title="Edit Tender"
                    >
                      <Edit size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-10 text-center font-black uppercase text-neo-red italic">
                  DATA TENDER TIDAK DITEMUKAN DI DATABASE.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* UNIFIED MODAL (CREATE & UPDATE) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-neo-brutal-bg border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b-4 border-black p-6 bg-white">
              <h2 className="text-2xl font-black uppercase tracking-tighter italic flex items-center gap-2">
                <FileText /> {modalMode === 'create' ? 'Buat Dokumen Tender' : 'Edit Dokumen Tender'}
              </h2>
              <button onClick={closeModal} className="p-2 border-4 border-black bg-neo-red hover:bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 transition-all">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <div className="p-6 overflow-y-auto flex-1">
              <form id="tender-form" onSubmit={handleSubmit} className="space-y-6">
                
                <div className="bg-white border-4 border-black p-6 shadow-neo space-y-4">
                  <div>
                    <label className="block font-black uppercase text-sm mb-2">Pilih PR Referensi *</label>
                    <select 
                      required
                      value={formData.purchase_requisition_id}
                      onChange={(e) => setFormData({...formData, purchase_requisition_id: e.target.value})}
                      className="w-full border-4 border-black p-2 font-bold focus:outline-none focus:bg-neo-yellow transition-colors uppercase text-sm"
                    >
                      <option value="">-- PILIH PURCHASE REQUISITION --</option>
                      {purchaseRequisitions.map(pr => (
                        <option key={pr.id} value={pr.id}>{pr.pr_number} - {pr.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-black uppercase text-sm mb-2">Judul Pengadaan Lelang *</label>
                    <input 
                      type="text" 
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Contoh: Lelang Pengadaan Server Database Utama"
                      className="w-full border-4 border-black p-2 font-bold focus:outline-none focus:bg-neo-yellow transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-black uppercase text-sm mb-2">Deskripsi Detail Cakupan Lelang</label>
                    <textarea 
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Masukkan spesifikasi teknis singkat..."
                      rows="3"
                      className="w-full border-4 border-black p-2 font-bold focus:outline-none focus:bg-neo-yellow transition-colors"
                    />
                  </div>
                </div>

                <div className="bg-white border-4 border-black p-6 shadow-neo">
                  <h3 className="font-black uppercase text-md border-b-4 border-black pb-2 mb-4 flex items-center gap-2"><Calendar size={18}/> Masa Berlaku Lelang</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-black uppercase text-xs mb-2">Waktu Mulai *</label>
                      <input 
                        type="datetime-local" 
                        required
                        value={formData.start_date}
                        onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                        className="w-full border-4 border-black p-2 font-bold focus:outline-none focus:bg-neo-yellow transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block font-black uppercase text-xs mb-2">Waktu Penutupan *</label>
                      <input 
                        type="datetime-local" 
                        required
                        value={formData.end_date}
                        onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                        className="w-full border-4 border-black p-2 font-bold focus:outline-none focus:bg-neo-yellow transition-colors"
                      />
                    </div>
                  </div>
                </div>

              </form>
            </div>

            {/* Modal Footer */}
            <div className="border-t-4 border-black p-6 bg-white flex justify-end gap-3">
              <button 
                type="button" 
                onClick={closeModal}
                className="px-6 py-3 border-4 border-black font-black uppercase hover:bg-gray-100 transition-colors"
              >
                Batal
              </button>
              <button 
                type="submit" 
                form="tender-form"
                disabled={btnLoading}
                className="flex items-center gap-2 border-4 border-black bg-neo-green px-6 py-3 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:bg-gray-400"
              >
                <Save size={18} /> {btnLoading ? 'MENYIMPAN...' : modalMode === 'create' ? 'Simpan Tender' : 'Simpan Perubahan'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Tender;