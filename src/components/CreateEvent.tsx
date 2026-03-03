import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../services/eventService";
import EventForm from '../components/EventForm';

export default function CreateEvent() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    async function handleCreate(data: any) {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            setLoading(true);
            await createEvent(token, data);
            navigate("/eventos");
        } catch (err) {
            alert("Erro ao criar evento");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main style={{ padding: 32 }}>
            <h1>Criar Evento</h1>
            <EventForm onSubmit={handleCreate} loading={loading} />
        </main>
    );
}