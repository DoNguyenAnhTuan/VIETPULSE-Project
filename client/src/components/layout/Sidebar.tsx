import { useState, useEffect } from "react";
import { FaHome, FaLayerGroup, FaChartLine, FaFileInvoiceDollar, FaSignOutAlt, FaTachometerAlt, FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const sidebarItems = [
  { 
    name: "Home", 
    icon: <FaHome className="h-5 w-5" />, 
    path: "/",
  },
  { 
    name: "Assets", 
    icon: <FaLayerGroup className="h-5 w-5" />,
    path: "#",
    submenu: [
      { name: "Meters", icon: <FaTachometerAlt className="h-4 w-4" />, path: "/meters" }
    ]
  },
  { 
    name: "Carbon Journey", 
    icon: <FaChartLine className="h-5 w-5" />,
    path: "/carbon-journey" 
  },
  { 
    name: "Billing Reports", 
    icon: <FaFileInvoiceDollar className="h-5 w-5" />,
    path: "/billing-report" 
  },
];

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    setOpenSubmenu(null);
    toggleSidebar();
  };

  const toggleSubmenu = (index: number) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

  const handleLogout = () => {
    // Remove login state from localStorage
    localStorage.removeItem("isLoggedIn");
    // Navigate to login page
    navigate("/login");
  };

  return (
    <aside
      style={{ overflow: 'visible' }}
      className={`bg-gradient-to-b from-[#e0f7fa] via-[#e0ffe7] to-[#f8fafc] text-[#0B3D61] ${isCollapsed ? 'w-16' : 'w-56'} shadow-xl flex-shrink-0 flex flex-col fixed md:relative inset-y-0 left-0 z-40 transition-all duration-300 ease-in-out transform ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      } border-r-2 border-[#b38e5d]/10`}
    >

      <div className={`p-3 ${isCollapsed ? 'p-2 flex flex-col items-center justify-center relative' : ''}`}>
        {!isCollapsed && (
          <div className="mb-1 pb-1 flex flex-col items-center">
            <img
              src="/assets/images/logo-15nam.png"
              alt="EIU 15 Years Logo"
              className="h-24 w-auto max-w-full object-contain mx-auto transition-all duration-300 drop-shadow-lg"
              onError={(e) => {
                console.error('Failed to load logo:', e);
                const target = e.target as HTMLImageElement;
                target.src = "https://placehold.co/250x70";
              }}
            />
            {/* <span className="mt-2 text-xs font-bold tracking-widest text-[#008080] uppercase">Green Energy</span> */}
          </div>
        )}
        {isCollapsed && (
          <button
            onClick={toggleCollapse}
            className="flex items-center justify-center bg-white text-[#0B3D61] p-2 rounded-full shadow-md border border-gray-200"
            style={{ position: "absolute", top: "70%", left: "50%", transform: "translate(-50%, -50%)" }}
          >
            <FaAngleDoubleRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {!isCollapsed && (
        <button
          onClick={toggleCollapse}
          className="absolute -right-3 top-20 bg-white text-[#0B3D61] p-1 rounded-full shadow-md border border-gray-200 flex items-center justify-center"
        >
          <FaAngleDoubleLeft className="h-4 w-4" />
        </button>
      )}

      <div className="pt-0 pb-0 px-0 flex items-center justify-between border-b border-sidebar-border">
        <div className="flex items-center space-x-2">
        </div>
      </div>
      
      <nav className="flex-1 py-4 px-2 overflow-visible">
        <ul className="space-y-2">
          {sidebarItems.map((item, index) => {
            const isActive = item.path === location.pathname || (item.submenu && item.submenu.some(subitem => subitem.path === location.pathname));
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isSubmenuOpen = openSubmenu === index;

            return (
              <li
                key={index}
                className="mb-1 relative group"
                onMouseEnter={() => {
                  if (isCollapsed) setOpenSubmenu(index);
                }}
                onMouseLeave={() => {
                  if (isCollapsed) setOpenSubmenu(null);
                }}
              >
                {hasSubmenu ? (
                  <>
                    <button
                      onClick={!isCollapsed ? () => toggleSubmenu(index) : undefined}
                      className={`w-full flex items-center ${isCollapsed ? 'px-2 justify-center' : 'px-5'} py-2 text-[#0B3D61] hover:scale-[1.04] hover:shadow-lg hover:bg-[#e0ffe7]/60 transition-all duration-200 rounded-2xl font-bold tracking-wider group relative ${
                        isActive ? "bg-[#e0ffe7] shadow-lg border-l-8 border-[#22c55e]" : "border-l-8 border-transparent"
                      }`}
                    >
                      <span className={`inline-flex items-center justify-center h-9 w-9 text-xl ${isActive ? 'bg-[#22c55e]/20 text-[#22c55e] shadow' : 'bg-white text-[#0B3D61]'} rounded-full transition-all duration-200 border-2 border-[#e0f7fa]`}> 
                        {item.icon}
                      </span>
                      {!isCollapsed && (
                        <>
                          <span className="ml-3 font-bold uppercase tracking-widest text-base">{item.name}</span>
                          <span className="ml-auto text-sm">
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className={`h-3 w-3 transition-transform text-[#0B3D61] ${isSubmenuOpen ? "rotate-90" : ""}`} 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </>
                      )}
                    </button>
                    {/* KHÔNG hiển thị tooltip tên Assets khi collapsed, chỉ hiện submenu popover */}
                    
                    {isCollapsed && isSubmenuOpen && (
                      <div className="absolute left-full top-1/2 -translate-y-1/2 z-50 bg-white shadow-lg rounded-md">
                        <ul>
                          {item.submenu.map((subitem, subIndex) => (
                            <li key={subIndex}>
                              <Link
                                to={subitem.path}
                              className="flex items-center px-3 py-2 text-[#0B3D61] hover:bg-[#e6f0fa] transition-colors rounded-md"
                              >
                                <span className="inline-flex items-center justify-center h-5 w-5 text-sm text-[#0B3D61]">
                                  {subitem.icon}
                                </span>
                                <span className="ml-2 text-sm font-medium">{subitem.name}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {!isCollapsed && isSubmenuOpen && (
                      <ul className="pl-10 pr-1 py-1 bg-[#e6f0fa]/60">
                        {item.submenu.map((subitem, subIndex) => (
                          <li key={subIndex} className="mb-0.5">
                            <Link 
                              to={subitem.path}
                              className={`flex items-center px-3 py-1 text-[#0B3D61] hover:bg-[#e6f0fa] transition-colors rounded-md ${
                                subitem.path === location.pathname ? "bg-[#e6f0fa]" : ""
                              }`}
                            >
                              <span className="inline-flex items-center justify-center h-5 w-5 text-sm text-[#0B3D61]">
                                {subitem.icon}
                              </span>
                              {!isCollapsed && <span className="ml-1 text-sm font-medium">{subitem.name}</span>}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <>
                    <Link 
                      to={item.path}
                      className={`flex items-center ${isCollapsed ? 'px-2 justify-center' : 'px-5'} py-2 text-[#0B3D61] hover:scale-[1.04] hover:shadow-lg hover:bg-[#e0ffe7]/60 transition-all duration-200 rounded-2xl font-bold tracking-wider group relative ${
                        item.path === location.pathname ? "bg-[#e0ffe7] shadow-lg border-l-8 border-[#22c55e]" : "border-l-8 border-transparent"
                      }`}
                    >
                      <span className={`inline-flex items-center justify-center h-9 w-9 text-xl ${item.path === location.pathname ? 'bg-[#22c55e]/20 text-[#22c55e] shadow' : 'bg-white text-[#0B3D61]'} rounded-full transition-all duration-200 border-2 border-[#e0f7fa]`}>
                        {item.icon}
                      </span>
                      {!isCollapsed && <span className="ml-3 font-bold uppercase tracking-widest text-base">{item.name}</span>}
                    </Link>
                    {/* Tooltip for collapsed sidebar, moved outside Link for group-hover to work */}
                    {isCollapsed && (
                      <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 whitespace-nowrap bg-gray-100 text-[#0B3D61] px-4 py-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all z-50">
                        {item.name}
                      </span>
                    )}
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Cây động nhỏ gọn */}
      <div className="flex justify-center items-center pb-2 pt-2">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <ellipse cx="30" cy="54" rx="20" ry="6" fill="#e6f4fb" />
          <rect x="26" y="36" width="8" height="18" rx="4" fill="#B38E5D" />
          <circle cx="30" cy="36" r="20" fill="#4CAF50" />
        </svg>
      </div>
      <div className="p-4 border-t border-gray-200 mt-auto">
        <button 
          onClick={handleLogout}
          className={`flex items-center justify-center gap-2 py-3 text-white bg-gradient-to-r from-[#22c55e] to-[#008080] hover:from-[#008080] hover:to-[#22c55e] rounded-2xl font-bold text-base shadow-lg transition-all w-full`}
        >
          <span className="inline-flex items-center justify-center h-8 w-8 text-lg">
            <FaSignOutAlt className="h-5 w-5" />
          </span>
          {!isCollapsed && <span className="ml-2 font-bold uppercase tracking-widest">Logout</span>}
        </button>
      </div>
    </aside>
  );
};


export default Sidebar;

// Component SVG cây động và nhân vật tưới nước
function WateringTree() {
  const [level, setLevel] = useState(1); // 1: nhỏ, 2: vừa, 3: lớn
  const [watering, setWatering] = useState(false);
  const [characterX, setCharacterX] = useState(-80); // vị trí nhân vật (bắt đầu xa hơn)
  const [direction, setDirection] = useState(1); // 1: sang phải, -1: sang trái

  useEffect(() => {
    let animId: ReturnType<typeof setTimeout> | undefined;
    // Đi chậm hơn (tăng khoảng cách, giảm tốc độ)
    if (characterX < 80 && direction === 1) {
      animId = setTimeout(() => setCharacterX(x => x + 1), 24);
    } else if (characterX > -80 && direction === -1) {
      animId = setTimeout(() => setCharacterX(x => x - 1), 24);
    } else if (characterX >= 80 && direction === 1) {
      // Đến cây, tưới nước
      setWatering(true);
      setTimeout(() => {
        setWatering(false);
        setLevel(lv => (lv < 3 ? lv + 1 : 3));
        setDirection(-1);
      }, 1200);
    } else if (characterX <= -80 && direction === -1) {
      setTimeout(() => setDirection(1), 600);
    }
    return () => clearTimeout(animId);
  }, [characterX, direction]);

  useEffect(() => {
    if (direction === 1 && characterX < 80) setCharacterX(x => x + 1);
    if (direction === -1 && characterX > -80) setCharacterX(x => x - 1);
  }, [direction]);

  // SVG cây to hơn, style giống hình mẫu
  const tree = [
    // Level 1: cây nhỏ
    <g key="1">
      <ellipse cx="96" cy="180" rx="40" ry="12" fill="#e6f4fb" />
      <rect x="86" y="120" width="20" height="60" rx="10" fill="#B38E5D" />
      <circle cx="96" cy="120" r="48" fill="#4CAF50" />
    </g>,
    // Level 2: cây vừa
    <g key="2">
      <ellipse cx="96" cy="180" rx="48" ry="14" fill="#e6f4fb" />
      <rect x="84" y="100" width="24" height="80" rx="12" fill="#B38E5D" />
      <circle cx="96" cy="100" r="60" fill="#4CAF50" />
    </g>,
    // Level 3: cây lớn
    <g key="3">
      <ellipse cx="96" cy="180" rx="60" ry="18" fill="#e6f4fb" />
      <rect x="80" y="60" width="32" height="120" rx="16" fill="#B38E5D" />
      <circle cx="96" cy="60" r="80" fill="#4CAF50" />
    </g>
  ];

  // SVG nhân vật góc nhìn ngang, đi chậm, thấy mặt
  const character = (
    <g style={{ transform: `translateX(${characterX}px)`, transition: 'transform 0.12s linear' }}>
      {/* Thân */}
      <ellipse cx="0" cy="170" rx="12" ry="18" fill="#0B3D61" />
      {/* Đầu */}
      <ellipse cx="0" cy="150" rx="13" ry="13" fill="#F9D7B5" stroke="#B38E5D" strokeWidth="2" />
      {/* Mắt */}
      <ellipse cx="-4" cy="148" rx="2" ry="2.5" fill="#222" />
      <ellipse cx="4" cy="148" rx="2" ry="2.5" fill="#222" />
      {/* Miệng */}
      <path d="M-3 154 Q0 157 3 154" stroke="#B38E5D" strokeWidth="1.5" fill="none" />
      {/* Tay */}
      <rect x="-16" y="165" width="8" height="4" rx="2" fill="#F9D7B5" transform="rotate(-20 -16 165)" />
      <rect x="8" y="165" width="8" height="4" rx="2" fill="#F9D7B5" transform="rotate(20 16 165)" />
      {/* Bình tưới */}
      <rect x="14" y="168" width="12" height="8" rx="4" fill="#81C784" />
      <rect x="24" y="170" width="4" height="4" rx="2" fill="#B38E5D" />
      {/* Nước */}
      {watering && <ellipse cx="30" cy="180" rx="4" ry="10" fill="#2196F3" opacity="0.7" />}
    </g>
  );

  return (
    <div className="flex justify-center items-center pb-2 relative" style={{ minHeight: 220 }}>
      <svg width="220" height="200" viewBox="0 0 220 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ zIndex: 1 }}>
        {tree[level - 1]}
        {character}
      </svg>
      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(-2deg) scale(1); }
          50% { transform: rotate(2deg) scale(1.04); }
        }
      `}</style>
    </div>
  );
}
