"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";

export default function Page() {
  return (
    <div>
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-center text-2xl font-bold mb-8">
          Panel de Productos
        </h1>

        <div className="flex justify-between mb-4">
          <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Crear Producto Nuevo
          </button>

          <div className="flex items-center">
            <input
              type="text"
              placeholder="Buscar"
              className="border border-gray-300 rounded-l py-2 px-4 focus:outline-none"
            />
            <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-r">
              Buscar
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead>
              <tr className="bg-blue-100 border-b-2 border-blue-200">
                <th className="py-2 px-4 text-left text-sm font-semibold">
                  Nombre
                </th>
                <th className="py-2 px-4 text-left text-sm font-semibold">
                  Correo Electrónico
                </th>
                <th className="py-2 px-4 text-left text-sm font-semibold">
                  Dirección
                </th>
                <th className="py-2 px-4 text-left text-sm font-semibold">
                  Teléfono
                </th>
                <th className="py-2 px-4 text-left text-sm font-semibold">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4 text-sm">Usuario 1</td>
                <td className="py-3 px-4 text-sm">usuario1@example.com</td>
                <td className="py-3 px-4 text-sm">Dirección 1</td>
                <td className="py-3 px-4 text-sm">555-1234</td>
                <td className="py-3 px-4 flex space-x-2">
                  <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded text-sm">
                    Editar
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm">
                    Eliminar
                  </button>
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 text-sm">Usuario 2</td>
                <td className="py-3 px-4 text-sm">usuario2@example.com</td>
                <td className="py-3 px-4 text-sm">Dirección 2</td>
                <td className="py-3 px-4 text-sm">555-5678</td>
                <td className="py-3 px-4 flex space-x-2">
                  <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded text-sm">
                    Editar
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm">
                    Eliminar
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm">Usuario 3</td>
                <td className="py-3 px-4 text-sm">usuario3@example.com</td>
                <td className="py-3 px-4 text-sm">Dirección 3</td>
                <td className="py-3 px-4 text-sm">555-9101</td>
                <td className="py-3 px-4 flex space-x-2">
                  <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded text-sm">
                    Editar
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm">
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
