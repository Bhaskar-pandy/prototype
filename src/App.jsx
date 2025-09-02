import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import { Building2, Users2, Trophy, MapPin, Menu, CreditCard, CheckCircle2, Loader2, Plus, Edit3, Trash2, Search, Globe, LogIn, LinkedinIcon } from "lucide-react";

// --- Utility UI bits (Tailwind-only) ---
const StatCard = ({ icon: Icon, label, value }) => (
  <div className="min-w-[160px] flex-1 rounded-2xl border bg-white/70 backdrop-blur p-4 shadow-sm flex items-center gap-4 transition-transform hover:scale-105">
    <div className="p-2 rounded-xl bg-indigo-50">
      {Icon ? <Icon className="w-6 h-6 text-indigo-600" /> : null}
    </div>
    <div className="min-w-0">
      <div className="text-gray-500 text-sm break-words">{label}</div>
      <div className="text-2xl font-semibold break-words">{value}</div>
    </div>
  </div>
);

const Badge = ({ children, tone = "gray" }) => {
  const toneMap = {
    gray: "bg-gray-100 text-gray-800",
    green: "bg-green-100 text-green-800",
    yellow: "bg-yellow-100 text-yellow-800",
    blue: "bg-blue-100 text-blue-800",
    red: "bg-red-100 text-red-800",
    indigo: "bg-indigo-100 text-indigo-800",
  };
  return <span className={`px-2 py-1 text-xs rounded-full font-medium ${toneMap[tone]}`}>{children}</span>;
};

const TextInput = ({ label, ...props }) => (
  <label className="block text-sm font-medium">
    <span className="text-gray-700">{label}</span>
    <input
      className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 transition"
      {...props}
    />
  </label>
);

const Select = ({ label, options = [], ...props }) => (
  <label className="block text-sm font-medium">
    <span className="text-gray-700">{label}</span>
    <select
      className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 transition"
      {...props}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </label>
);

const Button = ({ children, variant = "primary", icon: Icon, ...props }) => {
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-800 border",
    subtle: "bg-gray-100 hover:bg-gray-200 text-gray-800",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };
  return (
    <button
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl transition font-semibold ${variants[variant]}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

// --- Landing Page (Customer-facing) ---
function LandingPage({ language = "en", onSignIn, onServices, setLanguage }) {
  const t = useMemo(() => {
    const dict = {
      en: {
        properties: "Properties",
        about: "About Us",
        services: "Services",
        contact: "Contact",
        signin: "Sign In",
        headline: "Smart Living in Berlin",
        tagline: "Premium apartments, transparent renting, and trusted service.",
        cta: "Explore Properties",
        valuesTitle: "Our Core Values",
        servicesTitle: "What We Offer",
        valueItems: [
          { title: "Trust", text: "Transparent contracts & service you can rely on." },
          { title: "Quality", text: "Curated, well-maintained apartments across districts." },
          { title: "Support", text: "Dedicated tenant support for smooth living." },
        ],
        serviceItems: [
          { title: "Property Sales", text: "Buy and sell with expert guidance." },
          { title: "Rentals", text: "Flexible, well-located Berlin apartments." },
          { title: "Property Management", text: "End-to-end management for owners." },
        ],
      },
      de: {
        properties: "Immobilien",
        about: "Über uns",
        services: "Leistungen",
        contact: "Kontakt",
        signin: "Anmelden",
        headline: "Smartes Wohnen in Berlin",
        tagline: "Premium-Apartments, transparente Mieten und zuverlässiger Service.",
        cta: "Immobilien entdecken",
        valuesTitle: "Unsere Werte",
        servicesTitle: "Unsere Leistungen",
        valueItems: [
          { title: "Vertrauen", text: "Transparente Verträge & verlässlicher Service." },
          { title: "Qualität", text: "Kurierte, gepflegte Wohnungen in vielen Bezirken." },
          { title: "Support", text: "Engagierter Mieter-Support für reibungsloses Wohnen." },
        ],
        serviceItems: [
          { title: "Verkauf", text: "Kaufen und verkaufen mit Expertenbegleitung." },
          { title: "Vermietung", text: "Flexible, gut gelegene Berliner Wohnungen." },
          { title: "Hausverwaltung", text: "Rundum-Management für Eigentümer." },
        ],
      },
    };
    return dict[language];
  }, [language]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white text-gray-900 w-full">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b w-full">
        <div className="max-w-7xl mx-auto w-full px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 font-semibold">
            <img src="/logo.png" alt="Brandenbed Logo" className="w-8 h-8 rounded-xl" />
            <span className="ml-2 text-indigo-900 text-lg tracking-tight">Brandenbed Living Spaces</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a className="hover:text-indigo-600 transition" href="#properties">{t.properties}</a>
            <a className="hover:text-indigo-600 transition" href="#about">{t.about}</a>
            <a className="hover:text-indigo-600 transition" href="#services">{t.services}</a>
            <a className="hover:text-indigo-600 transition" href="#contact">{t.contact}</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              icon={Globe}
              aria-label="Change language"
              onClick={() => setLanguage(language === "en" ? "de" : "en")}
            >
              {language === "en" ? "DE" : "EN"}
            </Button>
            <Button icon={LogIn} onClick={onSignIn} aria-label="Sign In">{t.signin}</Button>
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" aria-label="Open menu">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto w-full px-4 py-16 grid md:grid-cols-2 items-center gap-10">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight text-indigo-900">{t.headline}</h1>
          <p className="mt-4 text-lg text-gray-700">{t.tagline}</p>
          <div className="mt-6 flex gap-3">
            <Button>{t.cta}</Button>
            <Button variant="ghost" onClick={onServices}>{t.services}</Button>
          </div>

          {/* Quick Stats */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 min-w-0">
            <StatCard icon={Trophy} label="Properties Sold" value="500+" />
            <StatCard icon={Users2} label="Happy Clients" value="1200+" />
            <StatCard icon={Building2} label="Years Experience" value="18+" />
            <StatCard icon={MapPin} label="Berlin Districts" value="8+" />
          </div>
        </div>
        <div className="aspect-video md:aspect-[4/3] rounded-3xl bg-gradient-to-tr from-indigo-100 to-white border shadow-inner flex items-center justify-center">
          <div className="text-center p-6">
            <div className="aspect-video md:aspect-[4/3] rounded-3xl overflow-hidden border shadow-inner">
              <img
                src="/image.png"
                alt="Modern buildings"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <p className="mt-3 text-gray-600">Modern living spaces in prime Berlin locations.</p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section id="about" className="max-w-7xl mx-auto w-full px-4 py-12">
        <h2 className="text-3xl font-bold text-indigo-900">{t.valuesTitle}</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {t.valueItems.map((v) => (
            <div key={v.title} className="rounded-2xl border p-6 bg-white shadow transition hover:shadow-lg">
              <h3 className="font-semibold text-indigo-700">{v.title}</h3>
              <p className="mt-2 text-gray-600 text-sm">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="max-w-7xl mx-auto w-full px-4 py-12">
        <h2 className="text-3xl font-bold text-indigo-900">{t.servicesTitle}</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {t.serviceItems.map((s) => (
            <div key={s.title} className="rounded-2xl border p-6 bg-white shadow transition hover:shadow-lg">
              <h3 className="font-semibold text-indigo-700">{s.title}</h3>
              <p className="mt-2 text-gray-600 text-sm">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="mt-8 border-t bg-white/80 w-full">
        <div className="max-w-7xl mx-auto w-full px-4 py-8 grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="font-semibold flex items-center gap-2">
              <img src="/logo.png" alt="Brandenbed Logo" className="w-5 h-5 rounded" />
              Brandenbed Living Spaces
            </div>
            <p className="mt-2 text-gray-600">Friedrichstraße 155, 10117 Berlin, Germany</p>
          </div>
          <div>
            <div className="font-semibold">Contact</div>
            <p className="mt-2 text-gray-600">contact@brandenbedlivingspaces.com</p>
            <p className="text-gray-600">+49 176 88317580</p>
          </div>
          <div>
            <div className="font-semibold">Social</div>
            <div className="mt-2 flex gap-3">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Badge tone="indigo"><LinkedinIcon className="inline w-4 h-4 mr-1" />LinkedIn</Badge>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Badge tone="gray">Instagram</Badge>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter/X">
                <Badge tone="blue">Twitter/X</Badge>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- Dashboard (Internal Tool) ---
function Dashboard({ language, setLanguage }) {
  const t = useMemo(() => ({
    en: {
      dashboard: "Dashboard",
      properties: "Properties",
      tasks: "Tasks",
      queries: "Tenant Queries",
      rent: "Rent Collection",
      employees: "Employees",
      settings: "Settings",
      teamDashboard: "Team Dashboard",
    },
    de: {
      dashboard: "Übersicht",
      properties: "Immobilien",
      tasks: "Aufgaben",
      queries: "Mieteranfragen",
      rent: "Miete",
      employees: "Mitarbeiter",
      settings: "Einstellungen",
      teamDashboard: "Team-Dashboard",
    }
  })[language], [language]);

  const [section, setSection] = useState("dashboard");
  const [properties, setProperties] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [payments, setPayments] = useState([]);
  const [queries, setQueries] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/properties")
      .then(res => setProperties(res.data));
    axios.get("http://localhost:3001/employees")
      .then(res => setEmployees(res.data));
    axios.get("http://localhost:3001/payments")
      .then(res => setPayments(res.data));
    axios.get("http://localhost:3001/queries")
      .then(res => setQueries(res.data));
    axios.get("http://localhost:3001/tasks")
      .then(res => setTasks(res.data));
  }, []);

  const totalRent = payments.reduce((s, p) => s + p.amount, 0);

  const rentByMonth = [
    { month: "Jan", amount: 3800 },
    { month: "Feb", amount: 4100 },
    { month: "Mar", amount: 3900 },
    { month: "Apr", amount: 4400 },
    { month: "May", amount: 4600 },
    { month: "Jun", amount: 4800 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col gap-2 p-4 border-r bg-white">
        <div className="flex items-center gap-2 font-semibold mb-4">
          <img src="/logo.png" alt="Brandenbed Logo" className="w-6 h-6 rounded" />
          {t.teamDashboard}
        </div>
        <Button
          variant="ghost"
          icon={Globe}
          aria-label="Change language"
          onClick={() => setLanguage(language === "en" ? "de" : "en")}
          className="mb-2"
        >
          {language === "en" ? "DE" : "EN"}
        </Button>
        {[
          ["dashboard", t.dashboard],
          ["properties", t.properties],
          ["tasks", t.tasks],
          ["queries", t.queries],
          ["rent", t.rent],
          ["employees", t.employees],
          ["settings", t.settings],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSection(key)}
            className={`text-left px-3 py-2 rounded-xl hover:bg-gray-100 ${section === key ? "bg-gray-100 font-semibold" : ""}`}
          >
            {label}
          </button>
        ))}
      </aside>

      {/* Content */}
      <main className="flex-1 p-4 md:p-8">
        {section === "dashboard" && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={CreditCard} label="Total Rent (this dataset)" value={`€${totalRent.toLocaleString()}`} />
              <StatCard icon={Building2} label="Properties" value={properties.length} />
              <StatCard icon={Users2} label="Active Tenants" value={12} />
              <StatCard icon={Trophy} label="Resolved Queries" value={queries.filter(q=>q.status==="Resolved").length} />
            </div>
            <div className="rounded-2xl border bg-white p-4">
              <div className="font-semibold mb-3">Rent Collected by Month</div>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={rentByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="amount" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {section === "rent" && (
          <RentCollection payments={payments} setPayments={setPayments} />
        )}

        {section === "queries" && (
          <TenantQueries queries={queries} setQueries={setQueries} />
        )}

        {section === "properties" && (
          <PropertiesList properties={properties} setProperties={setProperties} />
        )}

        {section === "employees" && (
          <EmployeesList employees={employees} setEmployees={setEmployees} />
        )}

        {section === "tasks" && (
          <Tasks tasks={tasks} setTasks={setTasks} />
        )}

        {section === "settings" && (
          <div className="rounded-2xl border bg-white p-6">
            <div className="text-lg font-semibold">Settings</div>
            <p className="text-sm text-gray-600 mt-2">This is a prototype. Connect to your auth, database, and role system here.</p>
          </div>
        )}
      </main>
    </div>
  );
}

function RentCollection({ payments, setPayments }) {
  const [form, setForm] = useState({ property: "Apt #05, Mitte", tenant: "", amount: "", type: "Bank Transfer", id: "" });

  const addPayment = (e) => {
    e.preventDefault();
    if (!form.tenant || !form.amount || !form.id) return;
    setPayments((p) => [
      { id: form.id, property: form.property, tenant: form.tenant, amount: Number(form.amount), type: form.type, reviewed: false },
      ...p,
    ]);
    setForm({ property: "Apt #05, Mitte", tenant: "", amount: "", type: "Bank Transfer", id: "" });
  };

  const toggleReviewed = (id) => {
    setPayments((p) => p.map((x) => (x.id === id ? { ...x, reviewed: !x.reviewed } : x)));
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <form onSubmit={addPayment} className="rounded-2xl border bg-white p-6 space-y-4 lg:col-span-1">
        <div className="text-lg font-semibold">Submit Payment</div>
        <Select
          label="Property"
          value={form.property}
          onChange={(e) => setForm({ ...form, property: e.target.value })}
          options={[
            { value: "Apt #05, Mitte", label: "Apt #05, Mitte" },
            { value: "Apt #12, Kreuzberg", label: "Apt #12, Kreuzberg" },
            { value: "Apt #20, Prenzlauer Berg", label: "Apt #20, Prenzlauer Berg" },
          ]}
        />
        <TextInput label="Tenant" value={form.tenant} onChange={(e) => setForm({ ...form, tenant: e.target.value })} />
        <TextInput label="Amount (€)" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
        <Select
          label="Payment Type"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          options={[
            { value: "Bank Transfer", label: "Bank Transfer" },
            { value: "Card", label: "Card" },
            { value: "Cash", label: "Cash" },
          ]}
        />
        <TextInput label="Transaction ID" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} />
        <div className="flex gap-2">
          <Button icon={Plus} type="submit">Add Payment</Button>
          <Button variant="ghost" type="reset" onClick={() => setForm({ property: "Apt #05, Mitte", tenant: "", amount: "", type: "Bank Transfer", id: "" })}>Reset</Button>
        </div>
      </form>

      <div className="rounded-2xl border bg-white p-6 lg:col-span-2 overflow-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold">Payment History</div>
          <div className="text-sm text-gray-500">{payments.length} records</div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="py-2">Transaction ID</th>
              <th className="py-2">Property</th>
              <th className="py-2">Tenant</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Type</th>
              <th className="py-2">Reviewed</th>
              <th className="py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="py-2">{p.id}</td>
                <td className="py-2">{p.property}</td>
                <td className="py-2">{p.tenant}</td>
                <td className="py-2">€{p.amount.toLocaleString()}</td>
                <td className="py-2">{p.type}</td>
                <td className="py-2">
                  {p.reviewed ? <Badge tone="green">Reviewed</Badge> : <Badge tone="yellow">Pending</Badge>}
                </td>
                <td className="py-2">
                  <Button variant={p.reviewed ? "subtle" : "primary"} icon={CheckCircle2} onClick={() => toggleReviewed(p.id)}>
                    {p.reviewed ? "Unmark" : "Mark Reviewed"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TenantQueries({ queries, setQueries }) {
  const updateStatus = (id, status) => {
    setQueries((q) => q.map((x) => (x.id === id ? { ...x, status } : x)));
  };

  const toneFor = (s) => (s === "Resolved" ? "green" : s === "In Progress" ? "blue" : "yellow");

  return (
    <div className="rounded-2xl border bg-white p-6">
      <div className="text-lg font-semibold mb-4">Tenant Queries</div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="py-2">ID</th>
            <th className="py-2">Tenant</th>
            <th className="py-2">Issue</th>
            <th className="py-2">Status</th>
            <th className="py-2">Update</th>
          </tr>
        </thead>
        <tbody>
          {queries.map((q) => (
            <tr key={q.id} className="border-t">
              <td className="py-2">{q.id}</td>
              <td className="py-2">{q.tenant}</td>
              <td className="py-2">{q.issue}</td>
              <td className="py-2"><Badge tone={toneFor(q.status)}>{q.status}</Badge></td>
              <td className="py-2">
                <div className="flex gap-2">
                  {[
                    ["Pending", "yellow"],
                    ["In Progress", "blue"],
                    ["Resolved", "green"],
                  ].map(([s]) => (
                    <Button key={s} variant="subtle" onClick={() => updateStatus(q.id, s)}>
                      {s}
                    </Button>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PropertiesList({ properties, setProperties }) {
  const [filter, setFilter] = useState("");
  const [searchText, setSearchText] = useState("");
  const [form, setForm] = useState({ id: null, name: "", district: "Mitte", rooms: 1, rent: 1000 });

  const districts = ["Mitte", "Kreuzberg", "Prenzlauer Berg", "Charlottenburg", "Friedrichshain"];

  const filtered = properties.filter((p) =>
    (filter ? p.district === filter : true) &&
    (searchText ? (p.name + p.district).toLowerCase().includes(searchText.toLowerCase()) : true)
  );

  const saveProperty = (e) => {
    e.preventDefault();
    if (!form.name) return;
    if (form.id) {
      const updatedProperty = { ...form, id: form.id, rent: Number(form.rent) };
      axios.put(`http://localhost:3001/properties/${form.id}`, updatedProperty)
        .then(res => {
          setProperties(prev => prev.map(p => p.id === form.id ? res.data : p));
        });
    } else {
      const newProperty = { ...form, id: Math.max(0, ...properties.map((i) => i.id)) + 1, rent: Number(form.rent) };
      axios.post("http://localhost:3001/properties", newProperty)
        .then(res => setProperties(prev => [...prev, res.data]));
    }
    setForm({ id: null, name: "", district: "Mitte", rooms: 1, rent: 1000 });
  };

  const editProperty = (p) => setForm(p);
  const removeProperty = (id) => {
    axios.delete(`http://localhost:3001/properties/${id}`)
      .then(() => {
        setProperties(prev => prev.filter(p => p.id !== id));
      });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              className="pl-9 pr-3 py-2 border rounded-xl w-full"
              placeholder="Search properties..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <select className="border rounded-xl px-3 py-2" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All Districts</option>
            {districts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <form onSubmit={saveProperty} className="rounded-2xl border bg-white p-6 space-y-4">
          <div className="text-lg font-semibold">Add / Edit Property</div>
          <TextInput label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Select label="District" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} options={districts.map((d)=>({value:d,label:d}))} />
          <TextInput label="Rooms" type="number" value={form.rooms} onChange={(e) => setForm({ ...form, rooms: Number(e.target.value) })} />
          <TextInput label="Rent (€)" type="number" value={form.rent} onChange={(e) => setForm({ ...form, rent: e.target.value })} />
          <div className="flex gap-2">
            <Button icon={form.id ? Edit3 : Plus} type="submit">{form.id ? "Update" : "Add"}</Button>
            {form.id && (
              <Button variant="ghost" onClick={() => setForm({ id: null, name: "", district: "Mitte", rooms: 1, rent: 1000 })}>Cancel</Button>
            )}
          </div>
        </form>

        <div className="lg:col-span-2 rounded-2xl border bg-white p-6 overflow-auto">
          <div className="text-lg font-semibold mb-3">Properties ({filtered.length})</div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2">ID</th>
                <th className="py-2">Name</th>
                <th className="py-2">District</th>
                <th className="py-2">Rooms</th>
                <th className="py-2">Rent</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="py-2">{p.id}</td>
                  <td className="py-2">{p.name}</td>
                  <td className="py-2">{p.district}</td>
                  <td className="py-2">{p.rooms}</td>
                  <td className="py-2">€{p.rent.toLocaleString()}</td>
                  <td className="py-2 flex gap-2">
                    <Button variant="subtle" icon={Edit3} onClick={() => editProperty(p)}>Edit</Button>
                    <Button variant="danger" icon={Trash2} onClick={() => removeProperty(p.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function EmployeesList({ employees, setEmployees }) {
  const togglePermission = (id, perm) => {
    setEmployees((list) =>
      list.map((e) =>
        e.id === id
          ? {
              ...e,
              permissions: e.permissions.includes(perm)
                ? e.permissions.filter((p) => p !== perm)
                : [...e.permissions, perm],
            }
          : e
      )
    );
  };

  const perms = ["read", "write", "approve", "admin"];
  return (
    <div className="rounded-2xl border bg-white p-6 overflow-auto">
      <div className="text-lg font-semibold mb-3">Employees</div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="py-2">ID</th>
            <th className="py-2">Name</th>
            <th className="py-2">Role</th>
            <th className="py-2">Permissions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((e) => (
            <tr key={e.id} className="border-t">
              <td className="py-2">{e.id}</td>
              <td className="py-2">{e.name}</td>
              <td className="py-2">{e.role}</td>
              <td className="py-2">
                <div className="flex flex-wrap gap-2">
                  {perms.map((p) => (
                    <button
                      key={p}
                      onClick={() => togglePermission(e.id, p)}
                      className={`px-2 py-1 rounded-full text-xs border ${
                        e.permissions.includes(p) ? "bg-indigo-600 text-white border-indigo-600" : "bg-gray-50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Tasks({ tasks, setTasks }) {
  const [text, setText] = useState("");

  const add = (e) => {
    e.preventDefault();
    if (!text) return;
    setTasks((t) => [{ id: Math.max(0, ...t.map((i) => i.id)) + 1, title: text, done: false }, ...t]);
    setText("");
  };

  const toggle = (id) => setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
  const remove = (id) => setTasks((t) => t.filter((x) => x.id !== id));

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <form onSubmit={add} className="rounded-2xl border bg-white p-6 space-y-4">
        <div className="text-lg font-semibold">Add Task</div>
        <TextInput label="Task" value={text} onChange={(e) => setText(e.target.value)} />
        <Button icon={Plus} type="submit">Add</Button>
      </form>
      <div className="lg:col-span-2 rounded-2xl border bg-white p-6">
        <div className="text-lg font-semibold mb-3">Tasks</div>
        <ul className="space-y-2">
          {tasks.map((t) => (
            <li key={t.id} className="flex items-center justify-between p-3 rounded-xl border">
              <label className="flex items-center gap-3">
                <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
                <span className={t.done ? "line-through text-gray-500" : ""}>{t.title}</span>
              </label>
              <Button variant="danger" icon={Trash2} onClick={() => remove(t.id)}>Delete</Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function LoginModal({ open, onClose, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-sm">
        <div className="text-lg font-semibold mb-4">Sign In</div>
        <form
          onSubmit={e => {
            e.preventDefault();
            onLogin(email, password);
          }}
          className="space-y-4"
        >
          <TextInput label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          <TextInput label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <div className="flex gap-2">
            <Button type="submit">Login</Button>
            <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Shell app to switch between prototypes ---
export default function App() {
  const [language, setLanguage] = useState("en");
  const [view, setView] = useState("landing");
  const [showLogin, setShowLogin] = useState(false);

  const handleLogin = (email, password) => {
    // You can add real authentication here
    setShowLogin(false);
    setView("dashboard");
  };

  return (
    <div className="min-h-screen">
      {/* Top Switcher */}
      <div className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            <Badge tone="indigo">Prototype</Badge>
            <button onClick={() => setView("landing")} className={`px-3 py-1.5 rounded-xl ${view === "landing" ? "bg-indigo-600 text-white" : "hover:bg-gray-100"}`}>Landing Page</button>
            <button onClick={() => setView("dashboard")} className={`px-3 py-1.5 rounded-xl ${view === "dashboard" ? "bg-indigo-600 text-white" : "hover:bg-gray-100"}`}>Team Dashboard</button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Language</span>
            <select className="border rounded-xl px-2 py-1" value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="en">EN</option>
              <option value="de">DE</option>
            </select>
          </div>
        </div>
      </div>
      {view === "landing" ? (
        <LandingPage
          language={language}
          onSignIn={() => setShowLogin(true)}
          onServices={() => setView("dashboard")}
          setLanguage={setLanguage}
        />
      ) : (
        <Dashboard
          language={language}
          setLanguage={setLanguage}
        />
      )}
      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} onLogin={handleLogin} />
    </div>
  );
}
