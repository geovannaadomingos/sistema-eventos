import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Eventos from "../pages/Eventos";
import Participantes from "../pages/Participantes";
import Checkin from "../pages/Checkin";
import PrivateRoute from './PrivateRoute';
import Layout from '../app/Layout';

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route element={<PrivateRoute />}>
                    <Route element={<Layout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/eventos" element={<Eventos />} />
                        <Route path="/participantes" element={<Participantes />} />
                        <Route path="/checkin" element={<Checkin />} />
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}