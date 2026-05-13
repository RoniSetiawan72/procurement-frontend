import React, { useState } from 'react';
import { Plus, Trash2, X, Save } from 'lucide-react';

const CreatePRModal = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [items, setItems] = useState([
    { item_name: '', specs: '', quantity: 1, uom: 'pcs', estimated_unit_price: 0 }
  ]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    setItems([
      ...items,
      { item_name: '', specs: '', quantity: 1, uom: 'pcs', estimated_unit_price: 0 }
    ]);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const grandTotal = items.reduce((total, item) => {
    return total + (Number(item.quantity) * Number(item.estimated_unit_price));
  }, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const payload = {
      title,
      description,
      items: items.map(item => ({
        ...item,
        quantity: Number(item.quantity),
        estimated_unit_price: Number(item.estimated_unit_price)
      }))
    };

    onSubmit(payload);
  };

  const inputClass = "w-full border-4 border-black p-2 font-bold focus:outline-none focus:bg-neo-yellow transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="bg-neo-brutal-bg border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-5xl max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b-4 border-black p-6 bg-white">
          <h2 className="text-2xl font-black uppercase tracking-tighter italic">Buat Dokumen PR</h2>
          <button 
            onClick={onClose}
            className="p-2 border-4 border-black bg-neo-red hover:bg-white active:translate-y-1 active:translate-x-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <X size={24} className="text-black" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto flex-1">
          <form id="pr-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* Section 1: Data Utama */}
            <div className="bg-white border-4 border-black p-6 shadow-neo">
              <h3 className="font-black uppercase text-lg border-b-4 border-black pb-2 mb-4">Informasi Dokumen</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-black uppercase text-sm mb-2">Judul Pengadaan *</label>
                  <input 
                    type="text" 
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={inputClass}
                    placeholder="Contoh: Pengadaan Obat Apotek Mei"
                  />
                </div>
                <div>
                  <label className="block font-black uppercase text-sm mb-2">Deskripsi Kebutuhan</label>
                  <input 
                    type="text" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={inputClass}
                    placeholder="Catatan tambahan untuk manajer..."
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Dynamic Items */}
            <div className="bg-white border-4 border-black p-6 shadow-neo">
              <div className="flex justify-between items-end border-b-4 border-black pb-2 mb-4">
                <h3 className="font-black uppercase text-lg">Daftar Barang</h3>
                <button 
                  type="button" 
                  onClick={handleAddItem}
                  className="flex items-center gap-2 border-2 border-black bg-neo-green px-3 py-1 font-black uppercase text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                >
                  <Plus size={16} /> Tambah Item
                </button>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="flex flex-wrap md:flex-nowrap gap-4 items-start p-4 bg-gray-50 border-2 border-dashed border-black">
                    <div className="w-full md:w-3/12">
                      <label className="block font-bold text-xs uppercase mb-1">Nama Barang</label>
                      <input 
                        type="text" required
                        value={item.item_name}
                        onChange={(e) => handleItemChange(index, 'item_name', e.target.value)}
                        className={inputClass} 
                        placeholder="Nama Item"
                      />
                    </div>
                    <div className="w-full md:w-3/12">
                      <label className="block font-bold text-xs uppercase mb-1">Spesifikasi</label>
                      <input 
                        type="text" 
                        value={item.specs}
                        onChange={(e) => handleItemChange(index, 'specs', e.target.value)}
                        className={inputClass} 
                        placeholder="Merek/Ukuran"
                      />
                    </div>
                    <div className="w-1/3 md:w-1/12">
                      <label className="block font-bold text-xs uppercase mb-1">Qty</label>
                      <input 
                        type="number" min="1" required
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        className={inputClass} 
                      />
                    </div>
                    <div className="w-1/3 md:w-2/12">
                      <label className="block font-bold text-xs uppercase mb-1">Satuan</label>
                      <select 
                        value={item.uom}
                        onChange={(e) => handleItemChange(index, 'uom', e.target.value)}
                        className={inputClass}
                      >
                        <option value="pcs">Pcs</option>
                        <option value="box">Box</option>
                        <option value="botol">Botol</option>
                        <option value="strip">Strip</option>
                        <option value="unit">Unit</option>
                      </select>
                    </div>
                    <div className="w-full md:w-2/12">
                      <label className="block font-bold text-xs uppercase mb-1">Harga Satuan</label>
                      <input 
                        type="number" min="0" required
                        value={item.estimated_unit_price}
                        onChange={(e) => handleItemChange(index, 'estimated_unit_price', e.target.value)}
                        className={inputClass} 
                      />
                    </div>
                    <div className="w-auto flex items-end justify-center pt-5">
                      <button 
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        disabled={items.length === 1}
                        className={`p-2 border-2 border-black ${items.length === 1 ? 'bg-gray-300' : 'bg-neo-red hover:bg-white'} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] transition-all`}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </form>
        </div>

        {/* Modal Footer */}
        <div className="border-t-4 border-black p-6 bg-white flex justify-between items-center">
          <div>
            <p className="font-bold uppercase text-sm">Estimasi Total</p>
            <p className="text-3xl font-black text-neo-red">
              Rp {grandTotal.toLocaleString('id-ID')}
            </p>
          </div>
          <button 
            type="submit" 
            form="pr-form"
            className="flex items-center gap-2 border-4 border-black bg-neo-blue px-8 py-4 font-black uppercase text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            <Save size={24} /> Simpan Draft PR
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreatePRModal;