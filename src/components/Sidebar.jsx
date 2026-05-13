import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Gavel, 
  ShoppingCart, 
  PackageCheck, 
  Users, 
  LogOut,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { useState } from 'react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const menus = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Purchase Req', path: '/purchase-requisitions', icon: <FileText size={20} /> },
    { name: 'Tenders', path: '/tenders', icon: <Gavel size={20} /> },
    { name: 'Purchase Order', path: '/po', icon: <ShoppingCart size={20} /> },
    { name: 'Goods Receipt', path: '/receipt', icon: <PackageCheck size={20} /> },
    { name: 'User Management', path: '/users', icon: <Users size={20} /> },
  ];

  const activeClass = "bg-neo-yellow shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]";
  const baseClass = `flex items-center ${isCollapsed ? 'justify-center p-3' : 'gap-4 p-4'} mb-4 border-4 border-black font-black uppercase transition-all hover:bg-neo-blue hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]`;

  return (
    <aside 
      className={`h-screen sticky top-0 bg-white border-r-4 border-black flex flex-col justify-between transition-all duration-300 ${isCollapsed ? 'w-24 p-4' : 'w-74 p-6'}`}
    >
      <div>
        {/* Header / Logo & Toggle Button */}
        <div className={`mb-10 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} border-b-4 border-black pb-4`}>
          
          {!isCollapsed && (
            <h1 className="text-2xl font-black uppercase tracking-tighter italic whitespace-nowrap overflow-hidden">
              SIMRS <span className="text-neo-red">PROC</span>
            </h1>
          )}

          {/* Tombol Toggle Neubrutalism */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Buka Sidebar" : "Tutup Sidebar"}
            className="p-2 border-4 border-black bg-neo-yellow hover:bg-neo-blue active:translate-y-1 active:translate-x-1 active:shadow-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            {isCollapsed ? <PanelLeftOpen size={24} /> : <PanelLeftClose size={24} />}
          </button>
        </div>

        {/* Menu Navigasi */}
        <nav>
          {menus.map((menu) => (
            <NavLink 
              key={menu.path} 
              to={menu.path}
              title={isCollapsed ? menu.name : ''}
              className={({ isActive }) => `${baseClass} ${isActive ? activeClass : "bg-white"}`}
            >
              <div>{menu.icon}</div>
              {/* Teks hanya dirender jika tidak collapse */}
              {!isCollapsed && <span className="whitespace-nowrap">{menu.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Tombol Logout */}
      <button 
        onClick={() => {
          localStorage.clear();
          window.location.href = '/login';
        }}
        title={isCollapsed ? "Logout" : ''}
        className={`flex items-center ${isCollapsed ? 'justify-center p-3' : 'gap-4 p-4'} border-4 border-black bg-neo-red font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all`}
      >
        <LogOut size={24} />
        {!isCollapsed && <span>Logout</span>}
      </button>
    </aside>
  );
};

export default Sidebar;