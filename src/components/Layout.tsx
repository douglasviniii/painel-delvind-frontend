import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FileText,
  CheckSquare,
  LifeBuoy,
  LogOut,
  Menu,
  X,
  Bell,
  User,
  Users,
  Settings,
  Calculator,
  PersonStanding,
  Moon,
  Sun,
} from 'lucide-react';
import Cookie from 'js-cookie';
import axios from 'axios';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const EndPointAPI = import.meta.env.VITE_END_POINT_API;
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<number>(0);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  const handlenotifications = async () => {
    try {
      const unreadAlerts = await axios.get(`${EndPointAPI}/notifications/find`, {
        headers: {
          Authorization: `Bearer ${Cookie.get('token')}`,
        },
      });
      setNotifications(unreadAlerts.data.length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications(0);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    navigate('/login');
    Cookie.remove('token');
    localStorage.removeItem('data');
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  };

  useEffect(() => {
    handlenotifications();
  }, []);

  useEffect(() => {
    document.body.classList.remove(isDarkMode ? 'bg-gray-100' : 'dark');
    document.body.classList.add(isDarkMode ? 'dark' : 'bg-gray-100');
  }, [isDarkMode]);

  const storedUsers = localStorage.getItem('data');
  const objectUser = storedUsers ? JSON.parse(storedUsers) : null;
  const user = objectUser;

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-primary text-white' : 'text-gray-700 hover:bg-primary-light hover:text-white';
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-black'} flex flex-col transition-colors duration-300`}>
      {/* Header */}
      <header className={`shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-primary'}`}>DELVIND</h1>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/alerts" className="relative">
              <Bell size={24} className={`text-gray-600 ${isDarkMode ? 'text-gray-300' : ''}`} />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </Link>

            <div className="hidden md:flex items-center space-x-2">
              <div className="text-right">
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>{user?.name}</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {user?.role === 'admin' ? 'Administrador' : 'Colaborador'}
                </p>
              </div>
            </div>

            {/* Dark Mode Toggle Button - Visible on mobile (md:hidden) */}
            <button
              onClick={toggleDarkMode}
              className="md:hidden text-gray-600"
            >
              {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden text-gray-600"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Dark Mode Toggle Button - Visible on desktop (md:flex) */}
            <button
              onClick={toggleDarkMode}
              className="hidden md:flex text-gray-600"
            >
              {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar - Desktop */}
        <aside className={`hidden md:block w-64 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <nav className="p-4 space-y-2">
            <Link
              to="/dashboard"
              className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${isActive('/dashboard')}`}
            >
              <FileText size={20} className={isDarkMode ? 'text-gray-300' : ''} />
              <span className={isDarkMode ? 'text-gray-300' : ''}>Relatórios</span>
            </Link>

            <Link
              to="/tasks"
              className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${isActive('/tasks')}`}
            >
              <CheckSquare size={20} className={isDarkMode ? 'text-gray-300' : ''} />
              <span className={isDarkMode ? 'text-gray-300' : ''}>Tarefas</span>
            </Link>

            <Link
              to="/tickets"
              className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${isActive('/tickets')}`}
            >
              <LifeBuoy size={20} className={isDarkMode ? 'text-gray-300' : ''} />
              <span className={isDarkMode ? 'text-gray-300' : ''}>Chamados</span>
            </Link>

            <Link
              to="/admin/teams"
              className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${isActive('/admin/teams')}`}
            >
              <Users size={20} className={isDarkMode ? 'text-gray-300' : ''} />
              <span className={isDarkMode ? 'text-gray-300' : ''}>Equipes</span>
            </Link>

            {/* LINK PARA O GITPOD */}
            <a
              href="https://gitpod.io/#https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 p-3 rounded-md transition-colors"
            >
              <span>
                <img
                  src="https://gitpod.io/button/open-in-gitpod.svg"
                  alt="Abrir no Gitpod"
                />
              </span>
            </a>

            {user?.role === 'admin' && (
              <>
                <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} my-4`}></div>
                <Link
                  to="/admin"
                  className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${isActive('/admin')}`}
                >
                  <Settings size={20} className={isDarkMode ? 'text-gray-300' : ''} />
                  <span className={isDarkMode ? 'text-gray-300' : ''}>Administração</span>
                </Link>

                <Link
                  to="/admin/users"
                  className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${isActive('/admin/users')}`}
                >
                  <User size={20} className={isDarkMode ? 'text-gray-300' : ''} />
                  <span className={isDarkMode ? 'text-gray-300' : ''}>Usuários</span>
                </Link>

                <Link
                  to="/AdminFinance"
                  className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${isActive('/AdminFinance')}`}
                >
                  <Calculator size={20} className={isDarkMode ? 'text-gray-300' : ''} />
                  <span className={isDarkMode ? 'text-gray-300' : ''}>Financeiro</span>
                </Link>

                <Link
                  to="/admin/budget"
                  className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${isActive('/admin/budget')}`}
                >
                  <Calculator size={20} className={isDarkMode ? 'text-gray-300' : ''} />
                  <span className={isDarkMode ? 'text-gray-300' : ''}>Orçamentos</span>
                </Link>

                <Link
                  to="/admin/clients"
                  className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${isActive('/admin/clients')}`}
                >
                  <PersonStanding size={20} className={isDarkMode ? 'text-gray-300' : ''} />
                  <span className={isDarkMode ? 'text-gray-300' : ''}>Clientes</span>
                </Link>
              </>
            )}

            <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} my-4`}></div>

            <button
              onClick={handleLogout}
              className={`flex items-center space-x-3 p-3 rounded-md text-gray-700 hover:bg-red-100 hover:text-red-600 w-full transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-red-900 hover:text-red-300' : ''}`}
            >
              <LogOut size={20} className={isDarkMode ? 'text-gray-300' : ''} />
              <span className={isDarkMode ? 'text-gray-300' : ''}>Sair</span>
            </button>
          </nav>
        </aside>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className={`bg-white w-64 h-full overflow-y-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Menu</h2>
                <button onClick={toggleMobileMenu}>
                  <X size={24} className={isDarkMode ? 'text-white' : 'text-gray-700'} />
                </button>
              </div>

              <div className="p-4 border-b border-gray-200">
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user?.name}</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {user?.role === 'admin' ? 'Administrador' : 'Colaborador'}
                </p>
              </div>

              <nav className="p-4 space-y-2">
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${isActive('/dashboard')}`}
                  onClick={toggleMobileMenu}
                >
                  <FileText size={20} className={isDarkMode ? 'text-gray-300' : ''} />
                  <span className={isDarkMode ? 'text-gray-300' : ''}>Relatórios</span>
                </Link>

                <Link
                  to="/tasks"
                  className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${isActive('/tasks')}`}
                  onClick={toggleMobileMenu}
                >
                  <CheckSquare size={20} className={isDarkMode ? 'text-gray-300' : ''} />
                  <span className={isDarkMode ? 'text-gray-300' : ''}>Tarefas</span>
                </Link>

                <Link
                  to="/tickets"
                  className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${isActive('/tickets')}`}
                  onClick={toggleMobileMenu}
                >
                  <LifeBuoy size={20} className={isDarkMode ? 'text-gray-300' : ''} />
                  <span className={isDarkMode ? 'text-gray-300' : ''}>Chamados</span>
                </Link>

                <Link
                  to="/admin/teams"
                  className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${isActive('/admin/teams')}`}
                  onClick={toggleMobileMenu}
                >
                  <Users size={20} className={isDarkMode ? 'text-gray-300' : ''} />
                  <span className={isDarkMode ? 'text-gray-300' : ''}>Equipes</span>
                </Link>

                {user?.role === 'admin' && (
                  <>
                    <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} my-4`}></div>
                    <Link
                      to="/admin"
                      className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${isActive('/admin')}`}
                      onClick={toggleMobileMenu}
                    >
                      <Settings size={20} className={isDarkMode ? 'text-gray-300' : ''} />
                      <span className={isDarkMode ? 'text-gray-300' : ''}>Administração</span>
                    </Link>

                    <Link
                      to="/admin/users"
                      className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${isActive('/admin/users')}`}
                      onClick={toggleMobileMenu}
                    >
                      <User size={20} className={isDarkMode ? 'text-gray-300' : ''} />
                      <span className={isDarkMode ? 'text-gray-300' : ''}>Usuários</span>
                    </Link>

                    <Link
                      to="/admin/budget"
                      className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${isActive('/admin/budget')}`}
                      onClick={toggleMobileMenu}
                    >
                      <Calculator size={20} className={isDarkMode ? 'text-gray-300' : ''} />
                      <span className={isDarkMode ? 'text-gray-300' : ''}>Orçamentos</span>
                    </Link>
                  </>
                )}

                <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} my-4`}></div>

                <button
                  onClick={() => {
                    handleLogout();
                    toggleMobileMenu();
                  }}
                  className={`flex items-center space-x-3 p-3 rounded-md text-gray-700 hover:bg-red-100 hover:text-red-600 w-full transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-red-900 hover:text-red-300' : ''}`}
                >
                  <LogOut size={20} className={isDarkMode ? 'text-gray-300' : ''} />
                  <span className={isDarkMode ? 'text-gray-300' : ''}>Sair</span>
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;