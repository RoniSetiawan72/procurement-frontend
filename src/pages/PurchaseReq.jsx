import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Eye, Edit, Send, CheckCircle, XCircle } from 'lucide-react';
import { getPurchaseReq, createPurchaseReq, updatePurchaseReq, submitPurchaseReq, approvePurchaseReq } from '../api/services/purchaseReqService';
import CreatePRModal from '../components/purchaseRequisitions/CreatePrModal';
import UpdatePRModal from '../components/purchaseRequisitions/UpdatePrModal';
import Swal from 'sweetalert2';
import DetailPrModal from '../components/purchaseRequisitions/DetailPrModal';

const PurchaseReq = () => {
  const [prs, setPrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPR, setSelectedPR] = useState(null);

  const handleCreatePR = async (payload) => {
    try {
      await createPurchaseReq(payload);
      setIsModalOpen(false);
      fetchPRs(); 
      
      Swal.fire({
        title: 'BERHASIL!',
        text: 'Draft Purchase Requisition telah disimpan.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#000000',
        background: '#fff',
        customClass: {
          popup: 'border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
          title: 'font-black italic uppercase',
          confirmButton: 'font-bold uppercase rounded-none border-2 border-black'
        }
      });
    } catch (error) {
      console.error("Gagal menyimpan PR", error);
      Swal.fire({
        title: 'GAGAL!',
        text: 'Terjadi kesalahan sistem saat menyimpan data.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#FF5C5C'
      });
    }
  };

  const handleEditClick = (pr) => {
    setSelectedPR(pr);
    setIsEditModalOpen(true);
  };

  const handleDetailClick = (pr) => {
    setSelectedPR(pr);
    setIsDetailModalOpen(true);
  };

  const fetchPRs = async () => {
    try {
      setLoading(true);
      const data = await getPurchaseReq();

      setPrs(data || []); 
    } catch (error) {
      console.error("Gagal mengambil data PR:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusAction = async (id, prNumber, actionType) => {
    const isSubmit = actionType === 'submit';
    
    const result = await Swal.fire({
      title: isSubmit ? 'SUBMIT DOKUMEN?' : 'APPROVE DOKUMEN?',
      text: isSubmit 
        ? `Dokumen ${prNumber} akan dikirim untuk approval dan tidak dapat diedit lagi.` 
        : `Apakah Anda yakin ingin menyetujui pengadaan ${prNumber}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: isSubmit ? 'YA, SUBMIT' : 'YA, APPROVE',
      cancelButtonText: 'BATAL',
      confirmButtonColor: isSubmit ? '#000000' : '#22C55E',
      background: '#ffffff',
      customClass: {
        popup: 'border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
        title: 'font-black uppercase italic',
        confirmButton: 'font-bold uppercase rounded-none border-2 border-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)]'
      }
    });

    if (result.isConfirmed) {
      try {
        if (isSubmit) {
          await submitPurchaseReq(id);
        } else {
          await approvePurchaseReq(id);
        }

        Swal.fire({
          title: 'BERHASIL!',
          text: `Status dokumen ${prNumber} telah diperbarui.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          customClass: { popup: 'border-4 border-black' }
        });

        fetchPRs(); // Refresh data tabel
      } catch (error) {
        console.error(`Gagal melakukan ${actionType}:`, error);
        Swal.fire('ERROR', 'Terjadi kesalahan sistem.', 'error');
      }
    }
  };

  useEffect(() => {
    fetchPRs();
  }, []);

  const filteredPRs = prs.filter(pr => 
    (pr.pr_number && pr.pr_number.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (pr.department?.name && pr.department.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const renderStatusBadge = (status) => {
    const baseClass = "px-3 py-1 text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]";
    switch (status) {
      case 'draft': return <span className={`${baseClass} bg-white text-black`}>Draft</span>;
      case 'pending': return <span className={`${baseClass} bg-neo-yellow text-black`}>Pending</span>;
      case 'approved': return <span className={`${baseClass} bg-neo-green text-black`}>Approved</span>;
      case 'rejected': return <span className={`${baseClass} bg-neo-red text-white`}>Rejected</span>;
      default: return <span className={`${baseClass} bg-gray-200 text-black`}>{status}</span>;
    }
  };

  return (
    <div className="w-full pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Purchase Requisitions</h1>
          <p className="font-bold text-gray-700 mt-1">Kelola daftar permintaan pembelian departemen</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 border-4 border-black bg-neo-blue px-6 py-3 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
        >
          <Plus size={20} /> Buat PR Baru
        </button>
      </div>

      {/* Toolbar: Search & Filter */}
      <div className="flex justify-between items-center bg-white border-4 border-black p-4 mb-6 shadow-neo">
        <div className="flex items-center w-full max-w-md border-4 border-black px-3 py-2 bg-neo-brutal-bg focus-within:bg-white transition-colors">
          <Search size={20} className="text-gray-500 mr-2" />
          <input 
            type="text" 
            placeholder="Cari ID Dokumen atau Departemen..." 
            className="w-full bg-transparent font-bold outline-none uppercase text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="font-black uppercase text-sm">
          Total Data: <span className="text-neo-red text-lg">{filteredPRs.length}</span>
        </div>
      </div>

      {/* Table Section */}
      <div className="border-4 border-black bg-white shadow-neo overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-4 border-black bg-neo-yellow text-sm uppercase">
              <th className="p-4 font-black">No. Dokumen</th>
              <th className="p-4 font-black">Tanggal</th>
              <th className="p-4 font-black">Departemen</th>
              <th className="p-4 font-black text-right">Estimasi Biaya</th>
              <th className="p-4 font-black text-center">Status</th>
              <th className="p-4 font-black text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-8 text-center font-black uppercase italic">Memuat data dari server...</td>
              </tr>
            ) : filteredPRs.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center font-black uppercase italic text-neo-red">Data tidak ditemukan.</td>
              </tr>
            ) : (
              filteredPRs.map((pr, index) => (
                <tr key={index} className="border-b-2 border-black hover:bg-orange-50 transition-colors group font-bold">
                  <td className="p-4 whitespace-nowrap">{pr.pr_number}</td>
                  <td className="p-4 whitespace-nowrap">
                    {new Date(pr.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td className="p-4 uppercase">{pr.department || 'UMUM'}</td>
                  <td className="p-4 text-right whitespace-nowrap">
                    Rp {Number(pr.estimated_total_cost).toLocaleString('id-ID')}
                  </td>
                  
                  <td className="p-4 text-center whitespace-nowrap">
                    {renderStatusBadge(pr.status)}
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    {/* Tombol Detail (Semua status bisa melihat detail) */}
                    {pr.status === 'draft' && (
                      <>
                        <button 
                          onClick={() => handleEditClick(pr)}
                          className="p-2 border-2 border-black bg-white hover:bg-neo-yellow transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                        >
                          <Edit size={18} />
                        </button>
                        
                        <button 
                          onClick={() => handleStatusAction(pr.id, pr.pr_number, 'submit')}
                          className="p-2 border-2 border-black bg-white hover:bg-neo-green transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                        >
                          <Send size={18} />
                        </button>
                      </>
                    )}

                    {/* Tombol Approve/Reject (Hanya muncul jika status pending - Logika RBAC bisa ditambahkan di sini nanti) */}
                    {pr.status === 'submitted' && (
                      <button 
                        onClick={() => handleStatusAction(pr.id, pr.pr_number, 'approve')}
                        className="p-2 border-2 border-black bg-neo-green text-black hover:bg-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <CreatePRModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreatePR}
      />

      <UpdatePRModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        prData={selectedPR}
        onUpdateSuccess={fetchPRs}
      />

      <DetailPrModal 
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        prData={selectedPR}
      />

    </div>
  );
};

export default PurchaseReq;