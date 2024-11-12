import { MoreVertical, ChevronLast, ChevronFirst, Home, User, Settings } from "lucide-react";
import { useContext, createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Link, useLocation } from "react-router-dom";
import logo from "../../images/logo/logo2.jpeg";

const SidebarContext = createContext();

// Mapeo de íconos según los roles
const iconMap = {
  Home: <Home />,
  User: <User />,
  Settings: <Settings />
};

// Opciones del sidebar basadas en los roleIds
const sidebarOptionsByRole = {
  "1": [ // Ejemplo de ID para 'admin'
    { path: "/admin/adminManagment", iconName: "Home", text: "Doctores" },
    { path: "/admin/newDoctor", iconName: "User", text: "Crear doctor" },
    { path: "/settings", iconName: "Settings", text: "Perfil" }
  ],
  "2": [ // Ejemplo de ID para 'doctor'
    { path: "/doctor/doctorsPage", iconName: "Home", text: "Dashboard" },
    { path: "/profile", iconName: "User", text: "Perfil" }
  ]
  // Otros roles según necesites
};

export function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const [userName, setUserName] = useState('');
  const [rut, setRut] = useState('');
  const [roleId, setRoleId] = useState('2'); // '2' por defecto para el rol de doctor
  const location = useLocation(); // Para obtener la ruta actual

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserName(decodedToken.fullName);
      setRut(decodedToken.rut);
      setRoleId(decodedToken.roleId); // Asumimos que roleId es el ID del rol
    }
  }, []);

  const sidebarItems = sidebarOptionsByRole[roleId] || [];

  return (
    <aside className="sticky top-0 h-screen">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src={logo}
            className={`overflow-hidden transition-all ${expanded ? "w-48" : "w-0"}`}
            alt=""
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">
            {sidebarItems.map((item, index) => (
              <Link to={item.path} className="text-gray-700" key={index}>
                <SidebarItem
                  iconName={item.iconName}
                  text={item.text}
                  active={location.pathname === item.path} // Establece como activo si la ruta coincide
                />
              </Link>
            ))}
          </ul>
        </SidebarContext.Provider>

        <div className="border-t flex p-3">
          <img
            src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
            alt=""
            className="w-10 h-10 rounded-md"
          />
          <div
            className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}
          >
            <div className="leading-4">
              <h4 className="font-semibold">{userName || "Doctor"}</h4>
              <span className="text-xs text-gray-600">{rut || "N/A"}</span>
            </div>
            <MoreVertical size={20} />
          </div>
        </div>
      </nav>
    </aside>
  );
}

export function SidebarItem({ iconName, text, active, alert }) {
  const { expanded } = useContext(SidebarContext);
  const icon = iconMap[iconName];

  return (
    <li
      className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
        active ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800" : "hover:bg-indigo-50 text-gray-600"
      }`}
    >
      {icon}
      <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>{text}</span>
      {alert && <div className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? "" : "top-2"}`} />}
      
      {!expanded && (
        <div
          className="absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-400"
        >
          {text}
        </div>
      )}
    </li>
  );
}
