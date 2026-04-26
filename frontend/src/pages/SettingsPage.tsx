import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Section, Button, Alert } from '@/shared/components/ui';
import { useFeedback } from '@/shared/hooks';

const STORAGE_KEY = 'spingpong_tiebreak_criteria';
const defaultCriteria = ['Vitórias', 'Confronto direto', 'Saldo de sets', 'Saldo de pontos', 'Sorteio manual'];

export function SettingsPage() {
  const [criteria, setCriteria] = useState(defaultCriteria);
  const { feedback, showSuccess, clear } = useFeedback();

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) {
        setCriteria(parsed);
      }
    } catch {
      // fallback para defaults
    }
  }, []);

  const saveCriteria = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(criteria));
    showSuccess('Parâmetros salvos com sucesso!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="heading-page">⚙️ Configurações</h1>
        <p className="text-neutral-600">Ajuste os parâmetros do sistema</p>
      </div>

      {/* Feedback */}
      {feedback && (
        <Alert type={feedback.type === 'success' ? 'success' : 'danger'} onClose={clear}>
          {feedback.msg}
        </Alert>
      )}

      {/* Tiebreak Criteria */}
      <Card>
        <Section
          title="📋 Critérios de Desempate"
          subtitle="Configure a ordem de prioridade para desempates em grupo"
        >
          <div className="space-y-3">
            <p className="text-sm text-neutral-600">
              Estes critérios são aplicados na classificação dos grupos em caso de empate.
              A persistência é local (seu navegador).
            </p>

            <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
              {criteria.map((item, i) => (
                <div key={item + i} className="flex items-center gap-2 p-2">
                  <span className="text-lg font-bold text-brand-600">#{i + 1}</span>
                  <span className="font-medium text-neutral-900">{item}</span>
                </div>
              ))}
            </div>

            <Button variant="primary" onClick={saveCriteria} isBlock>
              💾 Salvar Parâmetros
            </Button>
          </div>
        </Section>
      </Card>

      {/* Info Card */}
      <Card size="sm">
        <p className="text-xs text-neutral-600 text-center">
          💡 <strong>Dica:</strong> Os parâmetros são salvos no armazenamento local do seu navegador
        </p>
      </Card>

      <Card>
        <Section
          title="🧩 SPING_OPEN"
          subtitle="Gerencie as configurações oficiais de grupos e níveis usadas pelo backend"
        >
          <Link to="/configuracoes/sping-open" className="btn btn-primary inline-flex">
            Abrir Configuração SPING_OPEN
          </Link>
        </Section>
      </Card>
    </div>
  );
}
