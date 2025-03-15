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
  Calculator
} from 'lucide-react';
import Cookie from 'js-cookie';
import axios from 'axios';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const EndPointAPI = import.meta.env.VITE_END_POINT_API;

  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<number>(0);

  const handlenotifications = async () => {
    const unreadAlerts = await axios.get(`${EndPointAPI}/notifications/find`, {
      headers: {
        Authorization: `Bearer ${Cookie.get('token')}`,
      }
    });
    setNotifications(unreadAlerts.data.length);
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    navigate('/login');
    Cookie.remove('token');
    localStorage.removeItem('data');
  };

  useEffect(() => { handlenotifications(); }, [])

  //busca os dados do usuário no localStorage
  const storedUsers = localStorage.getItem("data");
  const objectUser = storedUsers ? JSON.parse(storedUsers) : null;
  const user = objectUser;

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-primary text-white' : 'text-gray-700 hover:bg-primary-light hover:text-white';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary">DELVIND</h1>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/alerts" className="relative">
              <Bell size={24} className="text-gray-700" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </Link>

            <div className="hidden md:flex items-center space-x-2">
              <div className="text-right">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.role === 'admin' ? 'Administrador' : 'Colaborador'}</p>
              </div>
            </div>

            <button
              onClick={toggleMobileMenu}
              className="md:hidden text-gray-700"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:block w-64 bg-white shadow-md">
          <nav className="p-4 space-y-2">
            <Link
              to="/dashboard"
              className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${isActive('/dashboard')}`}
            >
              <FileText size={20} />
              <span>Relatórios</span>
            </Link>

            <Link
              to="/tasks"
              className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${isActive('/tasks')}`}
            >
              <CheckSquare size={20} />
              <span>Tarefas</span>
            </Link>

            <Link
              to="/tickets"
              className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${isActive('/tickets')}`}
            >
              <LifeBuoy size={20} />
              <span>Chamados</span>
            </Link>

            <Link
                to="/admin/teams"
                className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${isActive('/admin/teams')}`}
              >
                <Users size={20} />
                <span>Equipes</span>
            </Link>

            {user.role === 'admin' && (
              <>
                <div className="border-t border-gray-200 my-4"></div>
                <Link
                  to="/admin"
                  className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${isActive('/admin')}`}
                >
                  <Settings size={20} />
                  <span>Administração</span>
                </Link>

                <Link
                  to="/admin/users"
                  className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${isActive('/admin/users')}`}
                >
                  <User size={20} />
                  <span>Usuários</span>
                </Link>

                

                <Link
                  to="/AdminFinance"
                  className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${isActive('/AdminFinance')}`}
                >
                  <Calculator size={20} />
                  <span>Financeiro</span>
                </Link>


                <Link
                  to="/admin/budget"
                  className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${isActive('/admin/budget')}`}
                >
                  <Calculator size={20} />
                  <span>Orçamentos</span>
                </Link>
              </>
            )}

            <div className="border-t border-gray-200 my-4"></div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 p-3 rounded-md text-gray-700 hover:bg-red-100 hover:text-red-600 w-full transition-colors"
            >
              <LogOut size={20} />
              <span>Sair</span>
            </button>
          </nav>
        </aside>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="bg-white w-64 h-full overflow-y-auto">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-bold text-lg">Menu</h2>
                <button onClick={toggleMobileMenu}>
                  <X size={24} />
                </button>
              </div>

              <div className="p-4 border-b border-gray-200">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.role === 'admin' ? 'Administrador' : 'Colaborador'}</p>
              </div>

              <nav className="p-4 space-y-2">
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${isActive('/dashboard')}`}
                  onClick={toggleMobileMenu}
                >
                  <FileText size={20} />
                  <span>Relatórios</span>
                </Link>

                <Link
                  to="/tasks"
                  className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${isActive('/tasks')}`}
                  onClick={toggleMobileMenu}
                >
                  <CheckSquare size={20} />
                  <span>Tarefas</span>
                </Link>

                <Link
                  to="/tickets"
                  className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${isActive('/tickets')}`}
                  onClick={toggleMobileMenu}
                >
                  <LifeBuoy size={20} />
                  <span>Chamados</span>
                </Link>

                <Link
                      to="/admin/teams"
                      className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${isActive('/admin/teams')}`}
                      onClick={toggleMobileMenu}
                    >
                      <Users size={20} />
                      <span>Equipes</span>
                    </Link>

                {user.role === 'admin' && (
                  <>
                    <div className="border-t border-gray-200 my-4"></div>
                    <Link
                      to="/admin"
                      className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${isActive('/admin')}`}
                      onClick={toggleMobileMenu}
                    >
                      <Settings size={20} />
                      <span>Administração</span>
                    </Link>

                    <Link
                      to="/admin/users"
                      className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${isActive('/admin/users')}`}
                      onClick={toggleMobileMenu}
                    >
                      <User size={20} />
                      <span>Usuários</span>
                    </Link>

                    

                    <Link
                      to="/admin/budget"
                      className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${isActive('/admin/budget')}`}
                      onClick={toggleMobileMenu}
                    >
                      <Calculator size={20} />
                      <span>Orçamentos</span>
                    </Link>
                  </>
                )}

                <div className="border-t border-gray-200 my-4"></div>

                <button
                  onClick={() => {
                    handleLogout();
                    toggleMobileMenu();
                  }}
                  className="flex items-center space-x-3 p-3 rounded-md text-gray-700 hover:bg-red-100 hover:text-red-600 w-full transition-colors"
                >
                  <LogOut size={20} />
                  <span>Sair</span>
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