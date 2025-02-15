import { useState, useEffect } from "react";

export default function WomenList() {
  const [women, setWomen] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: "",
    last_name: "",
    last_date: "",
    find: false,
    city: "",
    id_card: "",
  });
  const [editingId, setEditingId] = useState(null);

  const API_URL = "/api/api:HSjlSU0Z/women"; // Proxy en Vite para evitar CORS
  const token = localStorage.getItem("token"); // Token de autenticación

  useEffect(() => {
    fetchWomen();
  }, []);

  // ✅ Función genérica para hacer peticiones a la API
  const apiRequest = async (endpoint, method, data = null) => {
    try {
      const options = {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "", // ⬅️ Agrega el token si existe
        },
        body: data ? JSON.stringify(data) : null,
      };

      const response = await fetch(endpoint, options);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${response.status} ${response.statusText} - ${errorText}`);
      }

      return response.json();
    } catch (err) {
      console.error(`Error en ${method}:`, err.message);
      throw err;
    }
  };

  // ✅ Obtener lista de mujeres (GET)
  const fetchWomen = async () => {
    setLoading(true);
    try {
      console.log("Realizando petición a:", API_URL);
      const response = await fetch(API_URL, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Error al cargar datos: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Datos recibidos de la API:", data);

      if (data.result1 && Array.isArray(data.result1.items)) {
        setWomen(data.result1.items);
      } else {
        setWomen([]);
        console.error("La API no devolvió un array en result1.items:", data);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error en fetchWomen:", err.message);
    }
    setLoading(false);
  };

  // ✅ Crear un nuevo registro (POST)
  const handleCreate = async () => {
    try {
      await apiRequest(API_URL, "POST", form);
      fetchWomen();
      setForm({ name: "", last_name: "", last_date: "", find: false, city: "", id_card: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async () => {
    if (!form.id_card) {
      console.error("❌ Error: No hay ID Card seleccionado para actualizar");
      return;
    }
  
    const updatedData = {
      ...form,
      find: Boolean(form.find),
      last_date: form.last_date || null,
    };
  
    console.log("📡 URL de la API:", `${API_URL}/${form.id_card}`);
    console.log("📤 Datos enviados:", updatedData);
  
    try {
      await apiRequest(`${API_URL}/${form.id_card}`, "PATCH", updatedData);
      fetchWomen();
      setEditingId(null);
      setForm({ name: "", last_name: "", last_date: "", find: false, city: "", id_card: "" });
    } catch (err) {
      console.error("❌ Error en PATCH:", err.message);
      setError(err.message);
    }
  };
  
  

  // ✅ Eliminar un registro (DELETE)
  const handleDelete = async (id) => {
    if (!id) {
      console.error("Error: ID no válido para eliminar");
      return;
    }

    try {
      await apiRequest(`${API_URL}/${id}`, "DELETE");
      fetchWomen();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-4">
      <h2>Lista de Mujeres</h2>

      <button onClick={fetchWomen}>Cargar Lista</button>

      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="mb-4">
        <input type="text" placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input type="text" placeholder="Apellido" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
        <input type="date" placeholder="Última fecha" value={form.last_date} onChange={(e) => setForm({ ...form, last_date: e.target.value })} />
        <input type="checkbox" checked={form.find} onChange={(e) => setForm({ ...form, find: e.target.checked })} /> Encontrado
        <input type="text" placeholder="Ciudad" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <input type="text" placeholder="ID Card" value={form.id_card} onChange={(e) => setForm({ ...form, id_card: e.target.value })} />

        {editingId ? (
          <button onClick={handleUpdate}>Guardar</button>
        ) : (
          <button onClick={handleCreate}>Crear</button>
        )}
      </div>

      <ul>
        {Array.isArray(women) && women.length > 0 ? (
          women.map((woman) => (
            <li key={woman.id}>
              <strong>{woman.name} {woman.last_name}</strong> - {woman.city} - {woman.last_date} - 
              {woman.find ? " Sí" : " No"} - {woman.id_card}
              <button onClick={() => { setEditingId(woman.id); setForm(woman); }}>Editar</button>
              <button onClick={() => handleDelete(woman.id)}>Eliminar</button>
            </li>
          ))
        ) : (
          <p>No hay registros</p>
        )}
      </ul>
    </div>
  );
}

