import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://x8ki-letl-twmt.n7.xano.io/api:zke1KfsG";

const Auth = () => {
  const [name, setName] = useState(""); // Solo para registro
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Estado para manejar errores
  const [isLogin, setIsLogin] = useState(true); // Alterna entre login y registro
  const navigate = useNavigate();

  const handleAuth = async () => {
    setError(""); // Limpiar errores previos

    // Validaciones antes de enviar la solicitud
    if (!email || !password || (!isLogin && !name)) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      const endpoint = isLogin ? "user_login" : "user_signup";
      const body = isLogin ? { email, password } : { name, email, password };

      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error en autenticación");

      localStorage.setItem("token", data.authToken);
      navigate("/womenlist"); // 🔥 CAMBIADO para redirigir a /womenlist
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", textAlign: "center" }}>
      <h2>{isLogin ? "Iniciar Sesión" : "Registrarse"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>} {/* Mensaje de error */}

      {!isLogin && ( // Mostrar "nombre" solo en registro
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ display: "block", margin: "10px auto", padding: "8px" }}
        />
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", margin: "10px auto", padding: "8px" }}
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", margin: "10px auto", padding: "8px" }}
      />

      <button
        onClick={handleAuth}
        style={{ display: "block", margin: "10px auto", padding: "10px", backgroundColor: "#007bff", color: "#fff" }}
      >
        {isLogin ? "Iniciar Sesión" : "Registrarse"}
      </button>

      <p style={{ cursor: "pointer", color: "blue" }} onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
      </p>
    </div>
  );
};

export default Auth;
