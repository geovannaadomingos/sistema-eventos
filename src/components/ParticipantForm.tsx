import { useState } from "react";
import type { Participant } from "../types/Participant";
import type { Event } from "../types/Event";

interface Props {
    events: Event[];
    initialData?: Partial<Participant>;
    onSubmit: (data: Omit<Participant, "id" | "createdAt" | "updatedAt">) => Promise<void>;
}

export default function ParticipantForm({ events, initialData, onSubmit }: Props) {
    const [name, setName] = useState(initialData?.name || "");
    const [email, setEmail] = useState(initialData?.email || "");
    const [eventId, setEventId] = useState(initialData?.eventId || "");
    const [checkIn, setCheckIn] = useState(initialData?.checkIn || false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!name || !email || !eventId) {
            alert("Preencha todos os campos");
            return;
        }

        await onSubmit({ name, email, eventId, checkIn });
    }

    return (
        <form onSubmit={handleSubmit}>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />

            <select value={eventId} onChange={(e) => setEventId(e.target.value)}>
                <option value="">Selecione evento</option>
                {events.map((e) => (
                    <option key={e.id} value={e.id}>
                        {e.name}
                    </option>
                ))}
            </select>

            <label>
                <input
                    type="checkbox"
                    checked={checkIn}
                    onChange={(e) => setCheckIn(e.target.checked)}
                />
                Check-in realizado
            </label>

            <button type="submit">Salvar</button>
        </form>
    );
}