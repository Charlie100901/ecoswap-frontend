"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import config from '@/config';

export default function Page() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
  
      return () => clearTimeout(timer);
    }
  }, [error]);
  

  const handleLogin = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/auth/login`, {
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
        router.push("/");
      } else {
        setError("Correo o contraseña incorrectos.");
      }
    } catch (error) {
      setError("Ocurrió un error, por favor intenta nuevamente.");
    }
  };

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
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
      <div className="relative z-10 max-w-md w-full bg-white rounded-lg shadow-lg p-6 mt-16 animate-jump-in">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Iniciar Sesión
        </h2>

        

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
            onChange={handleChangeEmail}
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
            onChange={handleChangePassword}
          />
        </div>

        <div className="mb-4">
          <p className="text-gray-600">
            ¿Aún no tienes cuenta?{" "}
            <Link href="/register" className="text-green-700 hover:underline">
              Registrate
            </Link>
          </p>
        </div>

        <button
          className="w-full mt-6 bg-[#0B9710] text-white py-2 px-4 rounded-xl hover:bg-lime-800"
          onClick={handleLogin}
        >
          Iniciar Sesión
        </button>
      </div>
      {error && (
        <div
          className="fixed bottom-4 left-4 z-50 flex animate-fade-up items-center p-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800 max-w-md shadow-lg"
          role="alert"
        >
          <svg
            className="shrink-0 inline w-4 h-4 me-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div>
            <span className="font-medium">Danger alert!</span> {error}
          </div>
        </div>
      )}
    </div>
  );
}
