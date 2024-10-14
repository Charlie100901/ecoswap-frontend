"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.jwt);
        router.push('/');
      } else {
        setError("Correo o contraseña incorrectos.");
      }
    } catch (error) {
      setError("Ocurrió un error, por favor intenta nuevamente.");
    }
  };

  return (
    <div className="relative flex items-center justify-center w-full h-screen bg-gray-100">
      <img
        src="/img/background-auth.jpg"
        alt="background"
        className="absolute inset-0 w-full h-full object-cover filter brightness-[40%]"
      />

      <div className="relative z-10 max-w-md w-full bg-white rounded-lg shadow-lg p-6 mt-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Iniciar Sesión</h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-1">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ingresa tu correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 mb-1">Contraseña</label>
          <input
            type="password"
            id="password"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <p className="text-gray-600">
            ¿Aún no tienes cuenta? <a href="/register" className="text-green-700 hover:underline">Regístrate</a>
          </p>
        </div>

        <button
          className="w-full mt-6 bg-[#0B9710] text-white py-2 px-4 rounded-xl hover:bg-lime-800"
          onClick={handleLogin}
        >
          Iniciar Sesión
        </button>
      </div>
    </div>
  );
}
