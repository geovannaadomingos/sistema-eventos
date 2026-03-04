import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  getCheckinRules,
  createCheckinRule,
  updateCheckinRule,
  deleteCheckinRule,
} from '../../services/checkinRuleService';
import { validateCheckinRules } from '../../utils/validateCheckinRules';
import type { CheckinRule } from '../../types/CheckinRule';
import {
  FiTrash2,
  FiToggleLeft,
  FiToggleRight,
  FiPlus,
  FiClock,
  FiEdit2,
} from 'react-icons/fi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Checkbox from '../../components/ui/Checkbox';
import Select from '../../components/ui/Select';
import Card from '../../components/ui/Card';
import Alert from '../../components/ui/Alert';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Modal from '../../components/ui/Modal';
import clsx from 'clsx';

function formatRuleWindow(startMinutes: number, endMinutes: number) {
  const formatTime = (minutes: number) => {
    if (minutes === 0) return 'no momento do evento';
    if (minutes < 0) return `${Math.abs(minutes)} min antes do evento`;
    return `${Math.abs(minutes)} min após o evento`;
  };

  return `Inicia ${formatTime(startMinutes)} e encerra ${formatTime(endMinutes)}`;
}

export default function CheckinRules() {
  const { id: eventId } = useParams();

  const [rules, setRules] = useState<CheckinRule[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    startOffsetValue: 0,
    startOffsetUnit: 'before',
    endOffsetValue: 0,
    endOffsetUnit: 'after',
    required: false,
    active: true,
  });

  useEffect(() => {
    async function fetchRules() {
      if (!eventId) return;

      try {
        const data = await getCheckinRules(eventId);
        setRules(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchRules();
  }, [eventId]);

  useEffect(() => {
    setValidationErrors(validateCheckinRules(rules));
  }, [rules]);

  const errors: Record<string, string> = {};
  if (!form.name.trim()) errors.name = 'Nome da regra é obrigatório';

  const calcStart =
    form.startOffsetUnit === 'before'
      ? -Math.abs(form.startOffsetValue)
      : Math.abs(form.startOffsetValue);

  const calcEnd =
    form.endOffsetUnit === 'before'
      ? -Math.abs(form.endOffsetValue)
      : Math.abs(form.endOffsetValue);

  if (calcStart > calcEnd) {
    errors.window = 'Janela inicial não pode ser maior que a final';
  }

  async function handleCreate() {
    if (!eventId) return;

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setCreating(true);
    try {
      if (editingRuleId) {
        const updated = await updateCheckinRule(editingRuleId, {
          name: form.name,
          startOffsetMinutes: calcStart,
          endOffsetMinutes: calcEnd,
          required: form.required,
        });

        setRules((prev) =>
          prev.map((r) => (r.id === editingRuleId ? updated : r)),
        );
      } else {
        const rule = await createCheckinRule({
          name: form.name,
          startOffsetMinutes: calcStart,
          endOffsetMinutes: calcEnd,
          required: form.required,
          active: form.active,
          eventId,
        });

        setRules((prev) => [...prev, rule]);
      }
      setForm({
        name: '',
        startOffsetValue: 0,
        startOffsetUnit: 'before',
        endOffsetValue: 0,
        endOffsetUnit: 'after',
        required: false,
        active: true,
      });
      setEditingRuleId(null);
      setFormErrors({});
    } catch (err) {
      console.error(err);
      setFormErrors({ submit: 'Erro ao salvar regra' });
    } finally {
      setCreating(false);
    }
  }

  function handleEditRule(rule: CheckinRule) {
    setForm({
      name: rule.name,
      startOffsetValue: Math.abs(rule.startOffsetMinutes),
      startOffsetUnit: rule.startOffsetMinutes < 0 ? 'before' : 'after',
      endOffsetValue: Math.abs(rule.endOffsetMinutes),
      endOffsetUnit: rule.endOffsetMinutes < 0 ? 'before' : 'after',
      required: rule.required,
      active: rule.active,
    });
    setEditingRuleId(rule.id);
    setFormErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelEdit() {
    setForm({
      name: '',
      startOffsetValue: 0,
      startOffsetUnit: 'before',
      endOffsetValue: 0,
      endOffsetUnit: 'after',
      required: false,
      active: true,
    });
    setEditingRuleId(null);
    setFormErrors({});
  }

  async function handleToggle(rule: CheckinRule) {
    try {
      const updated = await updateCheckinRule(rule.id, {
        active: !rule.active,
      });

      setRules((prev) => prev.map((r) => (r.id === rule.id ? updated : r)));
    } catch (err) {
      console.error(err);
      setValidationErrors(['Erro ao atualizar regra.']);
    }
  }

  async function handleDelete(id: string) {
    try {
      setDeletingId(id);
      await deleteCheckinRule(id);
      setRules((prev) => prev.filter((r) => r.id !== id));
      setDeleteModalOpen(false);
      setSelectedRuleId(null);
    } catch (err) {
      console.error(err);
      setValidationErrors(['Erro ao remover regra.']);
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner message="Carregando regras de check-in..." />
      </div>
    );
  }

  return (
    <main className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Configuração de Check-in
        </h1>
        <p className="text-gray-600 mb-4">
          Gerencie as regras de check-in para os participantes deste evento.
        </p>

        <Alert type="info" closable={false} title="Como funcionam as regras?">
          <ul className="list-disc list-inside space-y-1 text-sm mt-2 text-gray-700">
            <li>
              <strong>Obrigatórias ou Opcionais:</strong> Você pode definir quais regras são essenciais para a entrada.
            </li>
            <li>
              <strong>Sempre ativo:</strong> É necessário manter pelo menos 1 regra ativa no painel.
            </li>
            <li>
              <strong>Sem conflitos:</strong> O sistema evita paradoxos validando que horários de regras <em>Obrigatórias</em> nunca sejam 100% excludentes entre si.
            </li>
          </ul>
        </Alert>
      </div>

      {validationErrors.length > 0 && (
        <div className="mb-6 space-y-2">
          {validationErrors.map((error, idx) => (
            <Alert key={idx} type="warning" closable={false}>
              {error}
            </Alert>
          ))}
        </div>
      )}

      {rules.length === 0 && (
        <Alert type="info" closable={false} className="mb-6">
          Nenhuma regra de check-in configurada. Crie pelo menos uma regra para
          ativar o check-in neste evento.
        </Alert>
      )}

      <Card className="mb-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
            {editingRuleId ? 'Editar Regra' : 'Adicionar Nova Regra'}
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreate();
            }}
            className="space-y-5"
          >
            {formErrors.submit && (
              <Alert type="error" closable onClose={() => setFormErrors({})}>
                {formErrors.submit}
              </Alert>
            )}

            <Input
              label="Nome da Regra *"
              placeholder="ex: QR Code, Lista Impressa, Email"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={formErrors.name}
              autoFocus
              disabled={loading || creating}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Início do Check-in
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="0"
                    value={form.startOffsetValue}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        startOffsetValue: Number(e.target.value),
                      })
                    }
                    icon={<FiClock size={18} />}
                    disabled={loading || creating}
                  />
                  <Select
                    value={form.startOffsetUnit}
                    onChange={(e) =>
                      setForm({ ...form, startOffsetUnit: e.target.value })
                    }
                    disabled={loading || creating}
                  >
                    <option value="before">min antes</option>
                    <option value="after">min depois</option>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Encerramento do Check-in
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="0"
                    value={form.endOffsetValue}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        endOffsetValue: Number(e.target.value),
                      })
                    }
                    icon={<FiClock size={18} />}
                    disabled={loading || creating}
                  />
                  <Select
                    value={form.endOffsetUnit}
                    onChange={(e) =>
                      setForm({ ...form, endOffsetUnit: e.target.value })
                    }
                    disabled={loading || creating}
                  >
                    <option value="before">min antes</option>
                    <option value="after">min depois</option>
                  </Select>
                </div>
              </div>
            </div>

            {formErrors.window && (
              <Alert type="error" closable={false}>
                {formErrors.window}
              </Alert>
            )}

            <Checkbox
              label="Marcar como obrigatória"
              checked={form.required}
              onChange={(e) => setForm({ ...form, required: e.target.checked })}
              disabled={loading || creating}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                variant="primary"
                className="gap-2"
                isLoading={creating}
              >
                <FiPlus size={18} />
                {editingRuleId ? 'Salvar Alterações' : 'Adicionar Regra'}
              </Button>
              {editingRuleId && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancelEdit}
                  disabled={creating}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </div>
      </Card>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Regras Configuradas
        </h2>

        {rules.length === 0 ? (
          <Card>
            <p className="text-gray-500 text-center py-8">
              Nenhuma regra de check-in cadastrada ainda.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {rules.map((rule) => (
              <Card
                key={rule.id}
                className={clsx(
                  'transition-all hover:shadow-lg',
                  rule.id === editingRuleId &&
                  'border-2 border-primary-500 shadow-md',
                  !rule.active &&
                  'bg-gray-50 opacity-75 border-l-4 border-l-gray-300'
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {rule.name}
                      </h3>
                      <span
                        className={clsx(
                          'inline-block px-2 py-1 rounded-full text-xs font-medium',
                          rule.required
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800',
                        )}
                      >
                        {rule.required ? 'Obrigatória' : 'Opcional'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">
                          Janela de Validação:
                        </span>
                        <p className="text-gray-900 font-medium">
                          {formatRuleWindow(
                            rule.startOffsetMinutes,
                            rule.endOffsetMinutes
                          )}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <p
                          className={clsx(
                            'font-semibold',
                            rule.active ? 'text-green-700' : 'text-gray-600',
                          )}
                        >
                          {rule.active ? '✓ Ativa' : '○ Inativa'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditRule(rule)}
                      title="Editar regra"
                    >
                      <FiEdit2 size={20} className="text-primary-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggle(rule)}
                      title={rule.active ? 'Desativar' : 'Ativar'}
                    >
                      {rule.active ? (
                        <FiToggleRight size={20} className="text-primary-600" />
                      ) : (
                        <FiToggleLeft size={20} className="text-gray-400" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedRuleId(rule.id);
                        setDeleteModalOpen(true);
                      }}
                      title="Remover regra"
                    >
                      <FiTrash2 size={20} className="text-error" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedRuleId(null);
        }}
        title="Confirmar exclusão"
        isDanger
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setDeleteModalOpen(false);
                setSelectedRuleId(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              isLoading={deletingId === selectedRuleId}
              onClick={() => selectedRuleId && handleDelete(selectedRuleId)}
            >
              Remover Regra
            </Button>
          </>
        }
      >
        <p className="text-gray-700">
          Tem certeza que deseja remover esta regra de check-in?
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Esta ação não pode ser desfeita.
        </p>
      </Modal>
    </main>
  );
}
