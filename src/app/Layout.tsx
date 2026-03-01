import { Outlet, Link } from "react-router-dom";

export default function Layout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: "200px", padding: "1rem", background: "#eee" }}>
        <nav>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/eventos">Eventos</Link></li>
            <li><Link to="/participantes">Participantes</Link></li>
            <li><Link to="/checkin">Check-in</Link></li>
          </ul>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: "1rem" }}>
        <Outlet />
      </main>
    </div>
  );
}