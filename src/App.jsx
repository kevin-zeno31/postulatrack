import { useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Clock3,
  CalendarCheck,
  Trophy,
  Search,
  Plus,
  LayoutDashboard,
} from "lucide-react";

import StatCard from "./components/StatCard";
import { initialApplications } from "./data/applications";

function App() {
  const [applications] = useState(initialApplications);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const stats = {
    total: applications.length,

    pending: applications.filter(
      (application) => application.status === "Pendiente"
    ).length,

    interviews: applications.filter(
      (application) => application.status === "Entrevista"
    ).length,

    offers: applications.filter(
      (application) => application.status === "Oferta"
    ).length,
  };

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const matchesSearch =
        application.company.toLowerCase().includes(search.toLowerCase()) ||
        application.position.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "Todos" ||
        application.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  return (
    <div className="layout">

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <BriefcaseBusiness size={20} />
          </div>

          <span>PostulaTrack</span>
        </div>

        <nav>
          <button className="nav-item active">
            <LayoutDashboard size={18} />
            Dashboard
          </button>
        </nav>

        <div className="sidebar-footer">
          <span>PostulaTrack</span>
          <small>Portfolio Project</small>
        </div>
      </aside>

      <main className="main-content">

        <header className="topbar">
          <div>
            <span className="eyebrow">
              DASHBOARD
            </span>

            <h1>Mis postulaciones</h1>

            <p>
              Gestiona y analiza tu proceso de búsqueda laboral.
            </p>
          </div>

          <button className="primary-button">
            <Plus size={18} />
            Nueva postulación
          </button>
        </header>

        <section className="stats-grid">

          <StatCard
            title="Total"
            value={stats.total}
            icon={BriefcaseBusiness}
          />

          <StatCard
            title="Pendientes"
            value={stats.pending}
            icon={Clock3}
          />

          <StatCard
            title="Entrevistas"
            value={stats.interviews}
            icon={CalendarCheck}
          />

          <StatCard
            title="Ofertas"
            value={stats.offers}
            icon={Trophy}
          />

        </section>

        <section className="applications-panel">

          <div className="panel-header">

            <div>
              <h2>Postulaciones recientes</h2>

              <p>
                {filteredApplications.length} resultados
              </p>
            </div>

            <div className="filters">

              <div className="search-box">
                <Search size={17} />

                <input
                  type="text"
                  placeholder="Buscar empresa o cargo..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
              >
                <option>Todos</option>
                <option>Pendiente</option>
                <option>Entrevista</option>
                <option>Oferta</option>
                <option>Rechazada</option>
              </select>

            </div>

          </div>

          <div className="table-wrapper">

            <table>

              <thead>
                <tr>
                  <th>Empresa</th>
                  <th>Cargo</th>
                  <th>Modalidad</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                </tr>
              </thead>

              <tbody>

                {filteredApplications.map((application) => (

                  <tr key={application.id}>

                    <td className="company">
                      {application.company}
                    </td>

                    <td>
                      {application.position}
                    </td>

                    <td>
                      {application.modality}
                    </td>

                    <td>
                      {application.date}
                    </td>

                    <td>

                      <span
                        className={`status status-${application.status.toLowerCase()}`}
                      >
                        {application.status}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

            {filteredApplications.length === 0 && (
              <div className="empty-results">
                No encontramos postulaciones.
              </div>
            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default App;