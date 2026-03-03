import { useState } from "react";
import type { Event } from "../types/Event";

interface Props {
    initialData?: Partial<Event>;
    onSubmit: (data: Omit<Event, "id" | "createdAt" | "updatedAt">) => Promise<void>;
    loading?: boolean;
}

export default function EventForm({ initialData, onSubmit, loading }: Props) {
    const [name, setName] = useState(initialData?.name || "");
    const [date, setDate] = useState(
        initialData?.date
            ? new Date(initialData.date).toISOString().slice(0, 16)
            : ""
    );
    const [location, setLocation] = useState(initialData?.location || "");
    const [status, setStatus] = useState<"ativo" | "encerrado">(
        (initialData?.status as "ativo" | "encerrado") || "ativo"
    );
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!name || !date || !location) {
            setError("Preencha todos os campos.");
            return;
        }

        await onSubmit({
            name,
            date,
            location,
            status,
        });
    }

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
            <div style={fieldStyle}>
                <label>Nome</label>
                <input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div style={fieldStyle}>
                <label>Data</label>
                <input
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>

            <div style={fieldStyle}>
                <label>Local</label>
                <input value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>

            <div style={fieldStyle}>
                <label>Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value as any)}>
                    <option value="ativo">Ativo</option>
                    <option value="encerrado">Encerrado</option>
                </select>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Salvar"}
            </button>
        </form>
    );
}

const fieldStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    marginBottom: 16,
};