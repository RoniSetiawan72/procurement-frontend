export const NeoCard = ({ children, color = "bg-white", className = "" }) => (
  <div className={`border-2 border-black p-6 ${color} shadow-neo ${className}`}>
    {children}
  </div>
);