export const RecentActivities = ({ activities }) => {
  return (
    <div className="mt-10 border-4 border-black bg-white shadow-neo p-6">
      <h3 className="text-2xl font-black uppercase mb-6 italic">Aktivitas Terakhir</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-4 border-black bg-gray-50 text-sm uppercase">
              <th className="p-4 font-black">ID Dokumen</th>
              <th className="p-4 font-black">Deskripsi</th>
              <th className="p-4 font-black">Vendor</th>
              <th className="p-4 font-black text-right">Nilai</th>
              <th className="p-4 font-black text-center">Status</th>
            </tr>
          </thead>
          <tbody className="font-bold">
            {activities?.map((item, index) => (
              <tr key={index} className="border-b-2 border-black hover:bg-neo-yellow transition-colors group">
                <td className="p-4 font-black">{item.id}</td>
                <td className="p-4 text-gray-700">{item.description}</td>
                <td className="p-4">{item.vendor}</td>
                <td className="p-4 text-right">Rp {Number(item.total).toLocaleString('id-ID')}</td>
                <td className="p-4 text-center">
                  <span className={`border-2 border-black px-3 py-1 text-xs uppercase font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] 
                    ${item.status === 'completed' ? 'bg-neo-green' : 
                      item.status === 'sent' ? 'bg-neo-blue' : 'bg-neo-yellow'}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};