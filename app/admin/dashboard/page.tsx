"use client";

import { useEffect, useState } from "react";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import config from '@/config';

export default function Page() {
  const [totals, setTotals] = useState({
    users: 0,
    products: 0,
    exchanges: 0,
  });

  useEffect(() => {
    async function fetchTotals() {
      try {
        const [usersRes, productsRes, exchangesRes] = await Promise.all([
          fetch(`${config.apiBaseUrl}/api/v1/users/count`),
          fetch(`${config.apiBaseUrl}/api/v1/products/counts`),
          fetch(`${config.apiBaseUrl}/api/v1/exchanges/counts`),
        ]);

        const usersData = await usersRes.json();
        const productsData = await productsRes.json();
        const exchangesData = await exchangesRes.json();
        setTotals({
          users: usersData,
          products: productsData,
          exchanges: exchangesData,
        });
      } catch (error) {
        console.error("Error fetching totals:", error);
      }
    }

    fetchTotals();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-zinc-800">
      <Header />
      <main className="flex-grow mb-9 mx-4 sm:mx-8 lg:mx-32 p-4">
        <div>
          <h1 className="text-center mt-14 mb-12 text-3xl font-bold text-gray-800 dark:text-white">
            ¡Bienvenido, Administrador!
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto mt-6">
          <a
            href="#"
            className="block p-6 border border-gray-300 bg-white rounded-lg shadow hover:bg-gray-100 dark:bg-zinc-700 dark:border-zinc-600 dark:hover:bg-zinc-600 transition-all duration-300"
          >
            <h5 className="mb-2 text-7xl font-bold tracking-tight text-green-600 dark:text-white text-center">
              {totals.users}
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400 text-center">
              Total de Usuarios
            </p>
          </a>
          <a
            href="#"
            className="block p-6 bg-white border border-gray-300 rounded-lg shadow hover:bg-gray-100 dark:bg-zinc-700 dark:border-zinc-600 dark:hover:bg-zinc-600 transition-all duration-300"
          >
            <h5 className="mb-2 text-7xl font-bold tracking-tight text-green-600 dark:text-white text-center">
              {totals.products}
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400 text-center">
              Total de Productos
            </p>
          </a>
          <a
            href="#"
            className="block p-6 bg-white border border-gray-300 rounded-lg shadow hover:bg-gray-100 dark:bg-zinc-700 dark:border-zinc-600 dark:hover:bg-zinc-600 transition-all duration-300"
          >
            <h5 className="mb-2 text-7xl font-bold tracking-tight text-green-600 dark:text-white text-center">
              {totals.exchanges}
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400 text-center">
              Total de Intercambios
            </p>
          </a>
        </div>
        <div className="mt-12">
          <h2 className="text-center font-bold text-2xl mt-4 text-gray-800 dark:text-white">
            Estadísticas Power BI
          </h2>
          <div className="justify-center flex mt-6">
            <iframe
              title="avance 1"
              width="1024"
              height="804"
              src="https://app.powerbi.com/view?r=eyJrIjoiNWU1Y2ZmZTEtZmZhOC00MTU3LWE2NGUtMjgyMTViMDdjMTllIiwidCI6IjlkMTJiZjNmLWU0ZjYtNDdhYi05MTJmLTFhMmYwZmM0OGFhNCIsImMiOjR9"
              frameBorder="0"
              allowFullScreen={true}
              className="rounded-lg shadow-lg"
            ></iframe>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
