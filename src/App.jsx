import { useEffect, useMemo, useState } from "react";

import {
  BriefcaseBusiness,
  CalendarCheck,
  Clock3,
  LayoutDashboard,
  Plus,
  Search,
  Trophy,
} from "lucide-react";

import StatCard from "./components/StatCard";
import { initialApplications } from "./data/applications";

/* =========================================================
   LOCAL STORAGE
   ========================================================= */

const STORAGE_KEY = "postulatrack-applications";

function getStoredApplications() {
  try {
    const storedApplications = localStorage.getItem(STORAGE_KEY);

    if (!storedApplications) {
      return initialApplications;
    }

    return JSON.parse(storedApplications);
  } catch (error) {
    console.error(
      "No se pudieron recuperar las postulaciones guardadas:",
      error
    );

    return initialApplications;
  }
}

/* =========================================================
   APP
   ========================================================= */

function App() {
  /* =========================================================
     STATES
     ========================================================= */

  const [applications, setApplications] = useState(getStoredApplications);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("Todos");

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [formData, setFormData] = useState({
    company: "",
    position: "",
    modality: "Remoto",
    status: "Pendiente",
    date: "",
  });

  /* =========================================================
     SAVE APPLICATIONS
     ========================================================= */

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(applications)
    );
  }, [applications]);

  /* =========================================================
     STATISTICS
     ========================================================= */

  const stats = {
    total: applications.length,

    pending: applications.filter(
      (application) =>
        application.status === "Pendiente"
    ).length,

    interviews: applications.filter(
      (application) =>
        application.status === "Entrevista"
    ).length,

    offers: applications.filter(
      (application) =>
        application.status === "Oferta"
    ).length,
  };

  /* =========================================================
     SEARCH AND FILTER
     ========================================================= */

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        application.company
          .toLowerCase()
          .includes(searchText) ||
        application.position
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "Todos" ||
        application.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  /* =========================================================
     FORM INPUTS
     ========================================================= */

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  /* =========================================================
     CREATE APPLICATION
     ========================================================= */

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !formData.company.trim() ||
      !formData.position.trim()
    ) {
      return;
    }

    const newApplication = {
      id: Date.now(),

      company: formData.company.trim(),

      position: formData.position.trim(),

      location: "Santiago",

      modality: formData.modality,

      status: formData.status,

      date: formData.date,
    };

    setApplications((previousApplications) => [
      newApplication,
      ...previousApplications,
    ]);

    setFormData({
      company: "",
      position: "",
      modality: "Remoto",
      status: "Pendiente",
      date: "",
    });

    setIsFormOpen(false);
  };

  /* =========================================================
     CLOSE FORM
     ========================================================= */

  const closeForm = () => {
    setIsFormOpen(false);

    setFormData({
      company: "",
      position: "",
      modality: "Remoto",
      status: "Pendiente",
      date: "",
    });
  };

  /* =========================================================
     INTERFACE
     ========================================================= */

  return (
    <div className="layout">
      {/* =====================================================
          SIDEBAR
          ===================================================== */}

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

      {/* =====================================================
          MAIN
          ===================================================== */}

      <main className="main-content">
        {/* ===================================================
            HEADER
            =================================================== */}

        <header className="topbar">
          <div>
            <span className="eyebrow">
              DASHBOARD
            </span>

            <h1>Mis postulaciones</h1>

            <p>
              Gestiona y analiza tu proceso de búsqueda
              laboral.
            </p>
          </div>

          <div className="topbar-actions">
            <div className="system-status">
              <span className="status-dot"></span>

              Datos guardados
            </div>

            <button
              className="primary-button"
              onClick={() => setIsFormOpen(true)}
            >
              <Plus size={18} />

              Nueva postulación
            </button>
          </div>
        </header>

        {/* ===================================================
            STATISTICS
            =================================================== */}

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

        {/* ===================================================
            APPLICATIONS
            =================================================== */}

        <section className="applications-panel">
          <div className="panel-header">
            <div>
              <h2>Postulaciones recientes</h2>

              <p>
                {filteredApplications.length} resultados
              </p>
            </div>

            <div className="filters">
              {/* SEARCH */}

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

              {/* FILTER */}

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

          {/* =================================================
              TABLE
              ================================================= */}

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
                {filteredApplications.map(
                  (application) => (
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
                        {application.date || "Sin fecha"}
                      </td>

                      <td>
                        <span
                          className={`status status-${application.status.toLowerCase()}`}
                        >
                          {application.status}
                        </span>
                      </td>
                    </tr>
                  )
                )}
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

      {/* =====================================================
          NEW APPLICATION MODAL
          ===================================================== */}

      {isFormOpen && (
        <div className="modal-overlay">
          <div className="modal">
            {/* MODAL HEADER */}

            <div className="modal-header">
              <div>
                <span className="eyebrow">
                  NUEVA POSTULACIÓN
                </span>

                <h2>Registrar oportunidad</h2>
              </div>

              <button
                className="close-button"
                onClick={closeForm}
                type="button"
              >
                ×
              </button>
            </div>

            {/* FORM */}

            <form onSubmit={handleSubmit}>
              {/* COMPANY */}

              <div className="form-group">
                <label htmlFor="company">
                  Empresa
                </label>

                <input
                  id="company"
                  type="text"
                  name="company"
                  placeholder="Ej: Microsoft"
                  value={formData.company}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* POSITION */}

              <div className="form-group">
                <label htmlFor="position">
                  Cargo
                </label>

                <input
                  id="position"
                  type="text"
                  name="position"
                  placeholder="Ej: Frontend Developer"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* MODALITY AND STATUS */}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="modality">
                    Modalidad
                  </label>

                  <select
                    id="modality"
                    name="modality"
                    value={formData.modality}
                    onChange={handleInputChange}
                  >
                    <option>Remoto</option>

                    <option>Híbrido</option>

                    <option>Presencial</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="status">
                    Estado
                  </label>

                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option>Pendiente</option>

                    <option>Entrevista</option>

                    <option>Oferta</option>

                    <option>Rechazada</option>
                  </select>
                </div>
              </div>

              {/* DATE */}

              <div className="form-group">
                <label htmlFor="date">
                  Fecha de postulación
                </label>

                <input
                  id="date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>

              {/* ACTIONS */}

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeForm}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  Guardar postulación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;