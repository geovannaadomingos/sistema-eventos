import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Events from '../pages/Events';
import Participants from "../pages/Participants";
import CreateParticipant from "../components/CreateParticipant";
import EditParticipant from "../components/EditParticipant";
import Checkin from '../pages/Checkin';
import PrivateRoute from './PrivateRoute';
import PublicRoute from "./PublicRoute";
import Layout from '../app/Layout';
import CreateEvent from "../components/CreateEvent";
import EditEvent from "../components/EditEvent";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />
                </Route>

                <Route element={<PrivateRoute />}>
                    <Route element={<Layout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/eventos" element={<Events />} />
                        <Route path="/eventos/criar" element={<CreateEvent />} />
                        <Route path="/eventos/editar/:id" element={<EditEvent />} />
                        <Route path="/participantes" element={<Participants />} />
                        <Route path="/participantes/criar" element={<CreateParticipant />} />
                        <Route path="/participantes/editar/:id" element={<EditParticipant />} />
                        <Route path="/checkin" element={<Checkin />} />
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}