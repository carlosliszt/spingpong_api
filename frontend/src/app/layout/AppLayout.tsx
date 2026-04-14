import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/store/authStore';

const links = [
  ['/', 'Dashboard'],
  ['/usuarios', 'Usuarios'],
  ['/atletas', 'Atletas'],
  ['/competicoes', 'Torneios'],
  ['/competicoes/wizard', 'Criar Torneio'],
  ['/jogos', 'Jogos'],
  ['/jogos/resultados', 'Resultados (global)'],
  ['/historico', 'Historicos (Read Only)'],
  ['/configuracoes', 'Configuracoes']
] as const;

export function AppLayout() {
  const navigate = useNavigate();
  const { clearSession, user } = useAuthStore();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="font-bold text-brand-700">SpingPong Torneios</Link>
          <button
            className="btn-secondary"
            onClick={() => {
              clearSession();
              navigate('/login');
            }}
          >
            Sair ({user?.nome ?? 'admin'})
          </button>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-4 md:grid-cols-[220px_1fr]">
        <nav className="card h-fit">
          <ul className="space-y-1">
            {links.map(([to, label]) => (
              <li key={to}>
                <NavLink to={to} className={({ isActive }) => `block rounded-md px-3 py-2 text-sm ${isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <main className="space-y-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
