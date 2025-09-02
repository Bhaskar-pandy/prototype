import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:3001"; // JSON Server API

function Dashboard() {
  // State for all entities
  const [properties, setProperties] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [payments, setPayments] = useState([]);
  const [queries, setQueries] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  // Form states
  const [newProperty, setNewProperty] = useState({ name: "", district: "", rooms: "", rent: "" });
  const [newEmployee, setNewEmployee] = useState({ name: "", role: "" });
  const [newPayment, setNewPayment] = useState({ property: "", tenant: "", amount: "", type: "", reviewed: false });
  const [newQuery, setNewQuery] = useState({ tenant: "", issue: "", status: "" });
  const [newTask, setNewTask] = useState({ title: "", done: false });

  // Fetch all data
  const fetchData = async () => {
    try {
      const [prop, emp, pay, q, t] = await Promise.all([
        axios.get(`${API}/properties`),
        axios.get(`${API}/employees`),
        axios.get(`${API}/payments`),
        axios.get(`${API}/queries`),
        axios.get(`${API}/tasks`),
      ]);
      setProperties(prop.data);
      setEmployees(emp.data);
      setPayments(pay.data);
      setQueries(q.data);
      setTasks(t.data);
    } catch (err) {
      setError("❌ Failed to fetch data. Is JSON server running?");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ---------- Properties ----------
  const addProperty = async () => {
    const res = await axios.post(`${API}/properties`, newProperty);
    setProperties([...properties, res.data]);
    setNewProperty({ name: "", district: "", rooms: "", rent: "" });
  };

  const updateProperty = async (id, updated) => {
    const res = await axios.patch(`${API}/properties/${id}`, updated);
    setProperties(properties.map(p => (p.id === id ? res.data : p)));
  };

  const deleteProperty = async (id) => {
    await axios.delete(`${API}/properties/${id}`);
    setProperties(properties.filter(p => p.id !== id));
  };

  // ---------- Employees ----------
  const addEmployee = async () => {
    const res = await axios.post(`${API}/employees`, newEmployee);
    setEmployees([...employees, res.data]);
    setNewEmployee({ name: "", role: "" });
  };

  const updateEmployee = async (id, updated) => {
    const res = await axios.patch(`${API}/employees/${id}`, updated);
    setEmployees(employees.map(e => (e.id === id ? res.data : e)));
  };

  const deleteEmployee = async (id) => {
    await axios.delete(`${API}/employees/${id}`);
    setEmployees(employees.filter(e => e.id !== id));
  };

  // ---------- Payments ----------
  const addPayment = async () => {
    const res = await axios.post(`${API}/payments`, newPayment);
    setPayments([...payments, res.data]);
    setNewPayment({ property: "", tenant: "", amount: "", type: "", reviewed: false });
  };

  const updatePayment = async (id, updated) => {
    const res = await axios.patch(`${API}/payments/${id}`, updated);
    setPayments(payments.map(p => (p.id === id ? res.data : p)));
  };

  const deletePayment = async (id) => {
    await axios.delete(`${API}/payments/${id}`);
    setPayments(payments.filter(p => p.id !== id));
  };

  // ---------- Queries ----------
  const addQuery = async () => {
    const res = await axios.post(`${API}/queries`, newQuery);
    setQueries([...queries, res.data]);
    setNewQuery({ tenant: "", issue: "", status: "" });
  };

  const updateQuery = async (id, updated) => {
    const res = await axios.patch(`${API}/queries/${id}`, updated);
    setQueries(queries.map(q => (q.id === id ? res.data : q)));
  };

  const deleteQuery = async (id) => {
    await axios.delete(`${API}/queries/${id}`);
    setQueries(queries.filter(q => q.id !== id));
  };

  // ---------- Tasks ----------
  const addTask = async () => {
    const res = await axios.post(`${API}/tasks`, newTask);
    setTasks([...tasks, res.data]);
    setNewTask({ title: "", done: false });
  };

  const toggleTask = async (id, done) => {
    const task = tasks.find(t => t.id === id);
    const res = await axios.patch(`${API}/tasks/${id}`, { done });
    setTasks(tasks.map(t => (t.id === id ? res.data : t)));
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API}/tasks/${id}`);
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div style={{ padding: 20 }}>
      {error && <div style={{ color: "red" }}>{error}</div>}

      {/* Properties */}
      <h2>🏠 Properties</h2>
      <input value={newProperty.name} placeholder="Name" onChange={e => setNewProperty({ ...newProperty, name: e.target.value })} />
      <input value={newProperty.district} placeholder="District" onChange={e => setNewProperty({ ...newProperty, district: e.target.value })} />
      <input type="number" value={newProperty.rooms} placeholder="Rooms" onChange={e => setNewProperty({ ...newProperty, rooms: e.target.value })} />
      <input type="number" value={newProperty.rent} placeholder="Rent" onChange={e => setNewProperty({ ...newProperty, rent: e.target.value })} />
      <button onClick={addProperty}>Add</button>
      <ul>
        {properties.map(p => (
          <li key={p.id}>
            {p.name} — {p.district} — {p.rooms} rooms — €{p.rent}
            <button onClick={() => updateProperty(p.id, { rent: Number(p.rent) + 100 })}>+100 Rent</button>
            <button onClick={() => deleteProperty(p.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {/* Employees */}
      <h2>👨‍💼 Employees</h2>
      <input value={newEmployee.name} placeholder="Name" onChange={e => setNewEmployee({ ...newEmployee, name: e.target.value })} />
      <input value={newEmployee.role} placeholder="Role" onChange={e => setNewEmployee({ ...newEmployee, role: e.target.value })} />
      <button onClick={addEmployee}>Add</button>
      <ul>
        {employees.map(e => (
          <li key={e.id}>
            {e.name} — {e.role}
            <button onClick={() => updateEmployee(e.id, { role: "Updated Role" })}>Update</button>
            <button onClick={() => deleteEmployee(e.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {/* Payments */}
      <h2>💰 Payments</h2>
      <input value={newPayment.property} placeholder="Property" onChange={e => setNewPayment({ ...newPayment, property: e.target.value })} />
      <input value={newPayment.tenant} placeholder="Tenant" onChange={e => setNewPayment({ ...newPayment, tenant: e.target.value })} />
      <input type="number" value={newPayment.amount} placeholder="Amount" onChange={e => setNewPayment({ ...newPayment, amount: e.target.value })} />
      <input value={newPayment.type} placeholder="Type" onChange={e => setNewPayment({ ...newPayment, type: e.target.value })} />
      <button onClick={addPayment}>Add</button>
      <ul>
        {payments.map(p => (
          <li key={p.id}>
            {p.tenant} paid €{p.amount} ({p.type})
            <button onClick={() => updatePayment(p.id, { reviewed: !p.reviewed })}>
              Mark {p.reviewed ? "Unreviewed" : "Reviewed"}
            </button>
            <button onClick={() => deletePayment(p.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {/* Queries */}
      <h2>📩 Queries</h2>
      <input value={newQuery.tenant} placeholder="Tenant" onChange={e => setNewQuery({ ...newQuery, tenant: e.target.value })} />
      <input value={newQuery.issue} placeholder="Issue" onChange={e => setNewQuery({ ...newQuery, issue: e.target.value })} />
      <input value={newQuery.status} placeholder="Status" onChange={e => setNewQuery({ ...newQuery, status: e.target.value })} />
      <button onClick={addQuery}>Add</button>
      <ul>
        {queries.map(q => (
          <li key={q.id}>
            {q.tenant}: {q.issue} ({q.status})
            <button onClick={() => updateQuery(q.id, { status: "Resolved" })}>Resolve</button>
            <button onClick={() => deleteQuery(q.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {/* Tasks */}
      <h2>✅ Tasks</h2>
      <input value={newTask.title} placeholder="Task Title" onChange={e => setNewTask({ ...newTask, title: e.target.value })} />
      <button onClick={addTask}>Add</button>
      <ul>
        {tasks.map(t => (
          <li key={t.id}>
            {t.title} — {t.done ? "Done" : "Pending"}
            <button onClick={() => toggleTask(t.id, !t.done)}>{t.done ? "Undo" : "Mark Done"}</button>
            <button onClick={() => deleteTask(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;