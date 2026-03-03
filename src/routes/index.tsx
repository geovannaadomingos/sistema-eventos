import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Events from '../pages/Events';
import Participants from '../pages/Participants';
import CreateEvent from '../pages/CreateEvent';
import EditEvent from '../pages/EditEvent';
import CreateParticipant from '../pages/CreateParticipant';
import EditParticipant from '../pages/EditParticipant';
import CheckinRules from '../pages/CheckinRules';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
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
            <Route path="/eventos" element={<Events />} />
            <Route path="/eventos/criar" element={<CreateEvent />} />
            <Route path="/eventos/editar/:id" element={<EditEvent />} />
            <Route path="/participantes" element={<Participants />} />
            <Route
              path="/participantes/criar"
              element={<CreateParticipant />}
            />
            <Route
              path="/participantes/editar/:id"
              element={<EditParticipant />}
            />
            <Route
              path="/eventos/:id/regras-checkin"
              element={<CheckinRules />}
            />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
