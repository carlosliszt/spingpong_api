import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from './layout/AppLayout';
import { useAuthStore } from '@/shared/store/authStore';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { UsersPage } from '@/pages/UsersPage';
import { AthletesPage } from '@/pages/AthletesPage';
import { CompetitionsPage } from '@/pages/CompetitionsPage';
import { CompetitionOperationsPage } from '@/pages/CompetitionOperationsPage';
import { RegistrationsPage } from '@/pages/RegistrationsPage';
import { CompetitionWizardPage } from '@/pages/CompetitionWizardPage';
import { CompetitionGroupsPage } from '@/pages/CompetitionGroupsPage';
import { CompetitionKnockoutPage } from '@/pages/CompetitionKnockoutPage';
import { OpenLevelsPage } from '@/pages/OpenLevelsPage';
import { MatchesPage } from '@/pages/MatchesPage';
import { MatchResultPage } from '@/pages/MatchResultPage';
import { MatchResultsViewPage } from '@/pages/MatchResultsViewPage';
import { HistoryPage } from '@/pages/HistoryPage';
import { SettingsPage } from '@/pages/SettingsPage';

function Protected() {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return <AppLayout />;
}

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    path: '/',
    element: <Protected />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'usuarios', element: <UsersPage /> },
      { path: 'atletas', element: <AthletesPage /> },
      { path: 'competicoes', element: <CompetitionsPage /> },
      { path: 'competicoes/:id/operacoes', element: <CompetitionOperationsPage /> },
      { path: 'competicoes/:id/inscricoes', element: <RegistrationsPage /> },
      { path: 'inscricoes', element: <RegistrationsPage /> },
      { path: 'competicoes/wizard', element: <CompetitionWizardPage /> },
      { path: 'competicoes/:id/grupos', element: <CompetitionGroupsPage /> },
      { path: 'competicoes/:id/mata-mata', element: <CompetitionKnockoutPage /> },
      { path: 'competicoes/:id/open-levels', element: <OpenLevelsPage /> },
      { path: 'jogos', element: <MatchesPage /> },
      { path: 'jogos/resultados', element: <MatchResultPage /> },
      { path: 'competicoes/:id/resultados', element: <MatchResultPage /> },
      { path: 'competicoes/:id/resultados/consulta', element: <MatchResultsViewPage /> },
      { path: 'historico', element: <HistoryPage /> },
      { path: 'configuracoes', element: <SettingsPage /> }
    ]
  }
]);
