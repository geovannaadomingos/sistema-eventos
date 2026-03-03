import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getCheckinRules,
  createCheckinRule,
  updateCheckinRule,
  deleteCheckinRule,
} from "../../services/checkinRuleService";
import { validateCheckinRules } from "../../utils/validateCheckinRules";
import type { CheckinRule } from "../../types/CheckinRule";

export default function CheckinRules() {
  const { id: eventId } = useParams();

  const [rules, setRules] = useState<CheckinRule[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    startOffsetMinutes: 0,
    endOffsetMinutes: 0,
    required: false,
    active: true,
  });

  useEffect(() => {
    async function fetchRules() {
      const token = localStorage.getItem("token");
      if (!token || !eventId) return;

      const data = await getCheckinRules(token, eventId);
      setRules(data);
      setLoading(false);
    }

    fetchRules();
  }, [eventId]);

  useEffect(() => {
    setErrors(validateCheckinRules(rules));
  }, [rules]);

  async function handleCreate() {
    const token = localStorage.getItem("token");
    if (!token || !eventId) return;

    const rule = await createCheckinRule(token, {
      ...form,
      eventId,
    });

    setRules((prev) => [...prev, rule]);
  }

  async function handleToggle(rule: CheckinRule) {
    const token = localStorage.getItem("token");
    if (!token) return;

    const updated = await updateCheckinRule(token, rule.id, {
      active: !rule.active,
    });

    setRules((prev) =>
      prev.map((r) => (r.id === rule.id ? updated : r))
    );
  }

  async function handleDelete(id: string) {
    const token = localStorage.getItem("token");
    if (!token) return;

    await deleteCheckinRule(token, id);
    setRules((prev) => prev.filter((r) => r.id !== id));
  }

  if (loading) return <p>Carregando regras...</p>;

  return (
    <main style={{ padding: 32 }}>
      <h1>Configuração de Check-in</h1>

      {errors.length > 0 && (
        <div style={{ background: "#ffe5e5", padding: 16, marginBottom: 20 }}>
          {errors.map((err, index) => (
            <p key={index} style={{ color: "red" }}>
              {err}
            </p>
          ))}
        </div>
      )}

      <h2>Adicionar Regra</h2>

      <input
        placeholder="Nome"
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <input
        type="number"
        placeholder="Minutos antes"
        value={form.startOffsetMinutes}
        onChange={(e) =>
          setForm({ ...form, startOffsetMinutes: Number(e.target.value) })
        }
      />

      <input
        type="number"
        placeholder="Minutos depois"
        value={form.endOffsetMinutes}
        onChange={(e) =>
          setForm({ ...form, endOffsetMinutes: Number(e.target.value) })
        }
      />

      <label>
        <input
          type="checkbox"
          checked={form.required}
          onChange={(e) =>
            setForm({ ...form, required: e.target.checked })
          }
        />
        Obrigatória
      </label>

      <button onClick={handleCreate}>Adicionar</button>

      <h2 style={{ marginTop: 40 }}>Regras</h2>

      {rules.length === 0 ? (
        <p>Nenhuma regra cadastrada.</p>
      ) : (
        <ul>
          {rules.map((rule) => (
            <li key={rule.id} style={{ marginBottom: 12 }}>
              <strong>{rule.name}</strong>
              <br />
              Janela: {rule.startOffsetMinutes} min antes até{" "}
              {rule.endOffsetMinutes} min depois
              <br />
              {rule.required ? "Obrigatória" : "Opcional"} |{" "}
              {rule.active ? "Ativa" : "Inativa"}
              <br />
              <button onClick={() => handleToggle(rule)}>
                {rule.active ? "Desativar" : "Ativar"}
              </button>
              <button onClick={() => handleDelete(rule.id)}>
                Remover
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}