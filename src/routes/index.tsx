import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Events from '../pages/Events';
import Participantes from "../pages/Participantes";
import Checkin from '../pages/Checkin';
import PrivateRoute from './PrivateRoute';
import PublicRoute from "./PublicRoute";
import Layout from '../app/Layout';

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
                        <Route path="/events" element={<Events />} />
                        <Route path="/participantes" element={<Participantes />} />
                        <Route path="/checkin" element={<Checkin />} />
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}