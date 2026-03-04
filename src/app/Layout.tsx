import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiHome,
  FiCalendar,
  FiUsers,
  FiLogOut,
  FiMenu,
  FiX,
} from 'react-icons/fi';
import { useState } from 'react';
import Button from '../components/ui/Button';
import clsx from 'clsx';

export default function Layout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FiHome },
    { path: '/eventos', label: 'Eventos', icon: FiCalendar },
    { path: '/participantes', label: 'Participantes', icon: FiUsers },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex flex-col h-full">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-primary-600">Eventos</h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {navItems.map(({ path, label, icon: Icon }) => {
                const isActive = location.pathname === path;
                return (
                  <li key={path}>
                    <Link
                      to={path}
                      onClick={() => setSidebarOpen(false)}
                      className={clsx(
                        'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                        isActive
                          ? 'bg-primary-100 text-primary-700 font-semibold'
                          : 'text-gray-700 hover:bg-gray-100',
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="px-4 py-6 border-t border-gray-200">
            <Button
              onClick={handleLogout}
              variant="danger"
              size="md"
              className="w-full justify-center"
            >
              <FiLogOut size={18} />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6 lg:py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <FiMenu size={24} />
            </button>
            <div />
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
