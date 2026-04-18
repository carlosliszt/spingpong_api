import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/store/authStore';
import { Button } from '@/shared/components/ui';

const navGroups = [
  {
    label: 'Menu Principal',
    items: [
      { to: '/', label: '📊 Dashboard' },
      { to: '/usuarios', label: '👥 Administradores' }
    ]
  },
  {
    label: 'Gerenciamento',
    items: [
      { to: '/atletas', label: '🏓 Atletas' },
      { to: '/competicoes', label: '🏆 Torneios' },
      { to: '/competicoes/wizard', label: '✨ Criar Torneio' }
    ]
  },
  {
    label: 'Operações de Torneio',
    items: [
      { to: '/jogos', label: '🎮 Jogos' },
      { to: '/jogos/resultados', label: '📝 Lançar Resultado' }
    ]
  },
  {
    label: 'Relatórios e Config',
    items: [
      { to: '/ranking', label: '🏆 Ranking & Rating' },
      { to: '/historico', label: '📋 Histórico' },
      { to: '/configuracoes', label: '⚙️ Configurações' }
    ]
  }
] as const;

export function AppLayout() {
  const navigate = useNavigate();
  const { clearSession, user } = useAuthStore();

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* HEADER */}
      <header className="border-b border-neutral-200 bg-white sticky top-0 z-40 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="text-2xl font-bold text-brand-600 hover:text-brand-700 transition-colors">
              🏓 SpingPong
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-sm text-neutral-600">
                {user?.nome ? `Bem-vindo, ${user.nome}` : 'Admin'}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  clearSession();
                  navigate('/login');
                }}
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="mx-auto max-w-7xl grid gap-4 px-4 py-4 md:grid-cols-[240px_1fr]">
        {/* SIDEBAR NAVIGATION */}
        <aside className="card h-fit sticky top-20 max-h-[calc(100vh-100px)] overflow-y-auto">
          <nav className="space-y-4">
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  {group.label}
                </p>
                <ul className="space-y-1">
                  {group.items.map(({ to, label }) => (
                    <li key={to}>
                      <NavLink
                        to={to}
                        className={({ isActive }) =>
                          `block px-3 py-2 rounded-md text-sm transition-colors ${
                            isActive
                              ? 'bg-brand-100 text-brand-700 font-medium'
                              : 'text-neutral-700 hover:bg-neutral-100'
                          }`
                        }
                      >
                        {label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="space-y-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
