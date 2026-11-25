
import { useCallback, useEffect, useState } from "react";
import { patientService } from "./services/patientService";
import "./App.css";

const OPTIONS = {
  gender: ["Male", "Female", "Other"],
  ward: ["General Ward", "ICU", "Private Ward", "Emergency"],
  department: [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "General Medicine",
  ],
  doctor: ["Dr. Sharma", "Dr. Reddy", "Dr. Priya", "Dr. Kumar"],
  status: ["Admitted", "Discharged"],
};

function today() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

const EMPTY_FORM = {
  name: "",
  age: "",
  gender: "",
  ward: "",
  department: "",
  doctor: "",
  admissionDate: today(),
  status: "Admitted",
};

function App() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    ward: "",
    department: "",
    doctor: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadPatients = useCallback(async () => {
    try {
      setLoading(true);
      const data = await patientService.getAll(filters);
      setPatients(data);
      setError("");
    } catch (err) {
      setError(err.message || "Unable to load patients.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  function resetForm() {
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    const name = form.name.trim();
    const age = Number(form.age);

    if (!/^[\p{L}]+(?:[ '\-][\p{L}]+)*$/u.test(name)) {
      setError("Name is required and must contain letters only.");
      return;
    }

    if (!Number.isInteger(age) || age < 0 || age > 120) {
      setError("Age must be between 0 and 120.");
      return;
    }

    if (!form.admissionDate || form.admissionDate > today()) {
      setError("Admission date is required and cannot be in the future.");
      return;
    }

    const data = { ...form, name, age };

    try {
      setSaving(true);

      if (editingId !== null) {
        await patientService.update(editingId, data);
        setMessage("Patient updated successfully.");
      } else {
        await patientService.add(data);
        setMessage("Patient added successfully.");
      }

      resetForm();
      await loadPatients();
    } catch (err) {
      setError(err.message || "Unable to save patient.");
    } finally {
      setSaving(false);
    }
  }

  function editPatient(patient) {
    setEditingId(patient.id);
    setForm({
      name: patient.name,
      age: String(patient.age),
      gender: patient.gender,
      ward: patient.ward,
      department: patient.department,
      doctor: patient.doctor,
      admissionDate: patient.admissionDate,
      status: patient.status,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deletePatient(id) {
    if (!window.confirm("Are you sure you want to delete this patient?")) {
      return;
    }

    try {
      await patientService.delete(id);
      setMessage("Patient deleted successfully.");
      await loadPatients();
    } catch (err) {
      setError(err.message);
    }
  }

  async function dischargePatient(id) {
    if (!window.confirm("Mark this patient as discharged?")) return;

    try {
      await patientService.discharge(id);
      setMessage("Patient marked as discharged.");
      await loadPatients();
    } catch (err) {
      setError(err.message);
    }
  }

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <main className="container">
      <header className="page-header">
        <div>
          <h1>Patient Admission Management</h1>
          <p>Register and manage hospital patient admissions.</p>
        </div>
      </header>

      {error && (
        <div className="alert error" role="alert">
          {error}
          <button onClick={() => setError("")}>×</button>
        </div>
      )}

      {message && (
        <div className="alert success" role="status">
          {message}
          <button onClick={() => setMessage("")}>×</button>
        </div>
      )}

      <section className="card">
        <div className="section-header">
          <h2>{editingId !== null ? "Edit Patient" : "Add New Patient"}</h2>
          <span>* Required fields</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="name">Patient Name *</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleFormChange}
                placeholder="Enter patient name"
                maxLength={100}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="age">Age *</label>
              <input
                id="age"
                name="age"
                type="number"
                min="0"
                max="120"
                step="1"
                value={form.age}
                onChange={handleFormChange}
                placeholder="Enter age"
                required
              />
            </div>

            {["gender", "ward", "department", "doctor"].map((key) => (
              <div className="field" key={key}>
                <label htmlFor={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)} *
                </label>
                <select
                  id={key}
                  name={key}
                  value={form[key]}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select {key}</option>
                  {OPTIONS[key].map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>
            ))}

            <div className="field">
              <label htmlFor="admissionDate">Admission Date *</label>
              <input
                id="admissionDate"
                name="admissionDate"
                type="date"
                max={today()}
                value={form.admissionDate}
                onChange={handleFormChange}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="status">Status *</label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleFormChange}
                required
              >
                {OPTIONS.status.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            {editingId !== null && (
              <button type="button" className="btn secondary" onClick={resetForm}>
                Cancel
              </button>
            )}
            <button type="submit" className="btn primary" disabled={saving}>
              {saving
                ? "Saving..."
                : editingId !== null
                  ? "Update Patient"
                  : "Add Patient"}
            </button>
          </div>
        </form>
      </section>

      <section className="card">
        <div className="section-header">
          <h2>Patient Records</h2>
          <span>{patients.length} patients</span>
        </div>

        <div className="filter-grid">
          <input
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search by patient name"
            aria-label="Search by patient name"
          />

          {["ward", "department", "doctor"].map((key) => (
            <select
              key={key}
              name={key}
              value={filters[key]}
              onChange={handleFilterChange}
              aria-label={`Filter by ${key}`}
            >
              <option value="">All {key.charAt(0).toUpperCase() + key.slice(1)}s</option>
              {OPTIONS[key].map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          ))}

          {hasFilters && (
            <button
              className="btn secondary"
              onClick={() => setFilters({
                search: "",
                ward: "",
                department: "",
                doctor: "",
              })}
            >
              Clear filters
            </button>
          )}
        </div>

        {loading ? (
          <p className="empty">Loading patient records...</p>
        ) : patients.length === 0 ? (
          <p className="empty">
            {hasFilters
              ? "No patients match your search or filters."
              : "No patient records found. Add your first patient above."}
          </p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Ward</th>
                  <th>Department</th>
                  <th>Doctor</th>
                  <th>Admission Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id}>
                    <td>{patient.name}</td>
                    <td>{patient.age}</td>
                    <td>{patient.gender}</td>
                    <td>{patient.ward}</td>
                    <td>{patient.department}</td>
                    <td>{patient.doctor}</td>
                    <td>{patient.admissionDate}</td>
                    <td>
                      <span className={`status ${patient.status.toLowerCase()}`}>
                        {patient.status}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <button
                          className="edit"
                          onClick={() => editPatient(patient)}
                        >
                          Edit
                        </button>

                        {patient.status === "Admitted" && (
                          <button
                            className="discharge"
                            onClick={() => dischargePatient(patient.id)}
                          >
                            Discharge
                          </button>
                        )}

                        <button
                          className="delete"
                          onClick={() => deletePatient(patient.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <footer>
        Patient Admission Management System
      </footer>
    </main>
  );
}

export default App;
