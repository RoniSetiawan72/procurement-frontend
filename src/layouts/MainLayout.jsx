import Sidebar from '../components/Sidebar';

const MainLayout = ({ children }) => {
  return (
    <div className="flex bg-neo-brutal-bg h-screen overflow-hidden">
      {/* Sidebar tetap di kiri */}
      <Sidebar />

      {/* Konten halaman di kanan */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-10 flex justify-between items-center">
          <div className="bg-white border-4 border-black p-4 shadow-neo">
            <p className="font-black uppercase text-sm">Operator: <span className="text-neo-blue">Roni Setiawan</span></p>
          </div>
          <div className="bg-neo-green border-4 border-black p-4 shadow-neo font-black uppercase">
            {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
          </div>
        </header>

        {children}
      </main>
    </div>
  );
};

export default MainLayout;