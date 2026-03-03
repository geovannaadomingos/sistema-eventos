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
import { FiTrash2, FiToggleLeft, FiToggleRight, FiPlus, FiClock } from 'react-icons/fi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Checkbox from '../../components/ui/Checkbox';
import Card from '../../components/ui/Card';
import Alert from '../../components/ui/Alert';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Modal from '../../components/ui/Modal';
import clsx from 'clsx';

export default function CheckinRules() {
  const { id: eventId } = useParams();

  const [rules, setRules] = useState<CheckinRule[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    startOffsetMinutes: 0,
    endOffsetMinutes: 0,
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
  if (form.startOffsetMinutes > form.endOffsetMinutes) {
    errors.window = 'Janela inicial não pode ser maior que a final';
  }

  async function handleCreate() {
    if (!eventId) return;

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const rule = await createCheckinRule({
        ...form,
        eventId,
      });

      setRules((prev) => [...prev, rule]);

      // reset form
      setForm({
        name: '',
        startOffsetMinutes: 0,
        endOffsetMinutes: 0,
        required: false,
        active: true,
      });
      setFormErrors({});
    } catch (err) {
      console.error(err);
      setFormErrors({ submit: 'Erro ao criar regra' });
    }
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Configuração de Check-in
        </h1>
        <p className="text-gray-600">
          Gerencie as regras de check-in para os participantes deste evento.
        </p>
      </div>

      {/* Validation Errors Alert */}
      {validationErrors.length > 0 && (
        <div className="mb-6 space-y-2">
          {validationErrors.map((error, idx) => (
            <Alert
              key={idx}
              type="warning"
              closable={false}
            >
              {error}
            </Alert>
          ))}
        </div>
      )}

      {/* Get Started Info */}
      {rules.length === 0 && (
        <Alert type="info" closable={false} className="mb-6">
          Nenhuma regra de check-in configurada. Crie pelo menos uma regra para ativar o
          check-in neste evento.
        </Alert>
      )}

      {/* Add Rule Card */}
      <Card className="mb-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
            <FiPlus size={20} />
            Adicionar Nova Regra
          </h2>

          <form className="space-y-5">
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
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Minutos Antes do Evento *"
                type="number"
                value={form.startOffsetMinutes}
                onChange={(e) =>
                  setForm({ ...form, startOffsetMinutes: Number(e.target.value) })
                }
                helperText="Quando liberar o check-in (neg. = antes)"
                icon={<FiClock size={18} />}
              />

              <Input
                label="Minutos Depois do Evento *"
                type="number"
                value={form.endOffsetMinutes}
                onChange={(e) =>
                  setForm({ ...form, endOffsetMinutes: Number(e.target.value) })
                }
                helperText="Quando encerrar o check-in"
                icon={<FiClock size={18} />}
              />
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
            />

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleCreate}
                variant="primary"
                className="gap-2"
              >
                <FiPlus size={18} />
                Adicionar Regra
              </Button>
            </div>
          </form>
        </div>
      </Card>

      {/* Rules List */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Regras Configuradas</h2>

        {rules.length === 0 ? (
          <Card>
            <p className="text-gray-500 text-center py-8">
              Nenhuma regra de check-in cadastrada ainda.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {rules.map((rule) => (
              <Card key={rule.id} className="transition-all hover:shadow-lg">
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
                            : 'bg-blue-100 text-blue-800'
                        )}
                      >
                        {rule.required ? 'Obrigatória' : 'Opcional'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Janela de Validação:</span>
                        <p className="text-gray-900 font-mono">
                          {rule.startOffsetMinutes} min antes até {rule.endOffsetMinutes} min
                          depois
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <p className={clsx(
                          'font-semibold',
                          rule.active ? 'text-green-700' : 'text-gray-600'
                        )}>
                          {rule.active ? '✓ Ativa' : '○ Inativa'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
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

      {/* Delete Confirmation Modal */}
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
