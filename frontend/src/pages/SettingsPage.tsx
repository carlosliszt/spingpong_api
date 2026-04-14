import { useEffect, useState } from 'react';

const STORAGE_KEY = 'spingpong_tiebreak_criteria';
const defaultCriteria = ['Vitorias', 'Confronto direto', 'Saldo de sets', 'Saldo de pontos', 'Sorteio manual'];

export function SettingsPage() {
  const [criteria, setCriteria] = useState(defaultCriteria);
  const [saved, setSaved] = useState(false);

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
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Configuracoes</h1>
      <section className="card space-y-2">
        <h2 className="font-semibold">Criterios de desempate (admin)</h2>
        <p className="text-sm text-slate-600">Persistencia local ativa. Voce pode ajustar ordem e salvar.</p>
        <ol className="list-decimal pl-5 text-sm">
          {criteria.map((item, i) => <li key={item + i}>{item}</li>)}
        </ol>
        <button className="btn-primary" onClick={saveCriteria}>Salvar parametros</button>
        {saved ? <p className="text-sm text-emerald-700">Parametros salvos com sucesso.</p> : null}
      </section>
    </div>
  );
}
