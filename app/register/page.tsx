"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RegisterPage() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [cellphoneNumber, setCellphone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          address,
          cellphoneNumber,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        localStorage.setItem("token", data.jwt);
        router.push("/");
      } else {
        setError("Error al registrar. Por favor, intenta nuevamente.");
      }
    } catch (err) {
      setError("Ocurrió un error inesperado. Intenta de nuevo.");
    }
  };

  const handleChange =
    (setter: (value: string) => void) => (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };

  return (
    <div className="relative flex items-center justify-center w-full h-screen bg-gray-100">
      <Image
        src="/img/background-auth.jpg"
        alt="background"
        fill
        className="absolute inset-0 object-cover filter brightness-[35%]"
        priority
      />

      <div className="relative z-10 max-w-md w-full bg-white rounded-lg shadow-lg p-6 mt-16 animate-fade-down">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Registrate</h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 mb-1">
              Nombre Completo <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="name"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingresa tu nombre completo"
              value={name}
              onChange={handleChange(setName)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-1">
              Correo Electrónico <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingresa tu correo"
              value={email}
              onChange={handleChange(setEmail)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="address" className="block text-gray-700 mb-1">
              Dirección <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="address"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingresa tu dirección"
              value={address}
              onChange={handleChange(setAddress)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="cellphone" className="block text-gray-700 mb-1">
              Teléfono <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="cellphone"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingresa tu teléfono"
              value={cellphoneNumber}
              onChange={handleChange(setCellphone)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-1">
              Contraseña <span className="text-red-600">*</span>
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={handleChange(setPassword)}
              required
            />
          </div>

          <div className="mb-4">
            <p className="text-gray-600">
              <input type="checkbox" id="terms" className="mr-2" required />
              Acepto los{" "}
              <Link href="#" className="text-blue-700">
                términos y condiciones
              </Link>
            </p>
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-[#0B9710] text-white py-2 px-4 rounded-xl hover:bg-lime-800"
          >
            Registrarme
          </button>
        </form>
      </div>
    </div>
  );
}
