export const NeoButton = ({ children, onClick, color = "bg-neo-blue" }) => (
  <button 
    onClick={onClick}
    className={`border-2 border-black px-4 py-2 ${color} shadow-neo active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all font-bold`}
  >
    {children}
  </button>
);