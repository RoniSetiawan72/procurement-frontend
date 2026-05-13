import React from 'react';
import { X, Printer, FileText, Calendar, Tag, User } from 'lucide-react';

const DetailPrModal = ({ isOpen, onClose, prData }) => {
  if (!isOpen || !prData) return null;

  const formatIDR = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const labelClass = "text-xs font-black uppercase text-gray-500 mb-1 flex items-center gap-1";
  const valueClass = "text-sm font-bold uppercase border-b-2 border-black pb-1";

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-neo-brutal-bg border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header Section */}
        <div className="flex justify-between items-center border-b-4 border-black p-6 bg-white">
          <div className="flex items-center gap-3">
            <div className="bg-neo-yellow p-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase italic tracking-tighter">Detail Purchase Requisition</h2>
              <p className="text-sm font-bold text-gray-600">{prData.pr_number}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => window.print()} 
              className="p-2 border-4 border-black bg-neo-green hover:bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 transition-all"
              title="Print Dokumen"
            >
              <Printer size={20} />
            </button>
            <button 
              onClick={onClose} 
              className="p-2 border-4 border-black bg-neo-red hover:bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 transition-all"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body Section */}
        <div className="p-6 overflow-y-auto bg-[#FDFCF0]">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-white border-4 border-black p-6 shadow-neo">
            <div>
              <span className={labelClass}><Tag size={12} /> Judul Pengadaan</span>
              <p className={valueClass}>{prData.title || '-'}</p>
            </div>
            <div>
              <span className={labelClass}><Calendar size={12} /> Tanggal Pengajuan</span>
              <p className={valueClass}>{prData.created_at ? new Date(prData.created_at).toLocaleDateString('id-ID', { dateStyle: 'long' }) : '-'}</p>
            </div>
            <div>
              <span className={labelClass}><User size={12} /> Departemen</span>
              <p className={valueClass}>{prData.department || 'UMUM'}</p>
            </div>
            <div className="md:col-span-3">
              <span className={labelClass}>Deskripsi / Catatan</span>
              <p className="text-sm font-medium border-l-4 border-black pl-3 py-1 bg-gray-50 italic">
                {prData.description || 'Tidak ada deskripsi tambahan.'}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white border-4 border-black shadow-neo overflow-hidden">
            <div className="bg-black text-white p-3 font-black uppercase tracking-widest text-sm text-center">
              Daftar Barang & Estimasi Biaya
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b-4 border-black">
                  <th className="p-3 text-left font-black uppercase text-xs border-r-2 border-black">Item & Spesifikasi</th>
                  <th className="p-3 text-center font-black uppercase text-xs border-r-2 border-black w-24">Qty</th>
                  <th className="p-3 text-center font-black uppercase text-xs border-r-2 border-black w-24">Satuan</th>
                  <th className="p-3 text-right font-black uppercase text-xs">Harga Satuan</th>
                  <th className="p-3 text-right font-black uppercase text-xs bg-neo-yellow/30">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {prData.items && prData.items.length > 0 ? (
                  prData.items.map((item, index) => (
                    <tr key={index} className="border-b-2 border-black last:border-0 font-bold text-sm">
                      <td className="p-3 border-r-2 border-black">
                        <div className="font-black uppercase">{item.item_name}</div>
                        <div className="text-xs text-gray-500 italic">{item.specs || '-'}</div>
                      </td>
                      <td className="p-3 text-center border-r-2 border-black">{item.quantity}</td>
                      <td className="p-3 text-center border-r-2 border-black uppercase">{item.uom}</td>
                      <td className="p-3 text-right border-r-2 border-black">{formatIDR(item.estimated_unit_price)}</td>
                      <td className="p-3 text-right bg-neo-yellow/10">
                        {formatIDR(item.quantity * item.estimated_unit_price)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-10 text-center font-black uppercase text-gray-400">Tidak ada item data</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Section */}
        <div className="border-t-4 border-black p-6 bg-white flex justify-between items-center">
          <div>
            <span className="text-xs font-black uppercase text-gray-500">Status Dokumen</span>
            <div className="mt-1">
              <span className={`px-4 py-1 border-2 border-black font-black uppercase text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                prData.status === 'approved' ? 'bg-neo-green' : 
                prData.status === 'draft' ? 'bg-gray-200' : 'bg-neo-blue'
              }`}>
                {prData.status}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="font-black uppercase text-xs text-gray-500 mb-1">Total Estimasi Biaya</p>
            <p className="text-3xl font-black text-neo-red underline decoration-black decoration-4 underline-offset-4">
              {formatIDR(prData.estimated_total_cost)}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DetailPrModal;