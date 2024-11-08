'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';

interface User {
  id: number;
  name: string;
  email: string;
  address: string;
  cellphoneNumber: string;
}

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        const response = await fetch('http://localhost:8080/api/v1/user', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener la lista de usuarios');
        }

        const data: User[] = await response.json();
        setUsers(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 mb-4"></div>
          <p className="text-lg text-gray-700">Cargando usuarios...</p>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-center text-2xl font-bold mb-8">Panel de Usuarios</h1>

        <div className="flex justify-between mb-4">
          <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Crear Usuario Nuevo
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
                <th className="py-2 px-4 text-left text-sm font-semibold">Nombre</th>
                <th className="py-2 px-4 text-left text-sm font-semibold">Correo Electrónico</th>
                <th className="py-2 px-4 text-left text-sm font-semibold">Dirección</th>
                <th className="py-2 px-4 text-left text-sm font-semibold">Teléfono</th>
                <th className="py-2 px-4 text-left text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No hay usuarios disponibles
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="py-3 px-4 text-sm">{user.name}</td>
                    <td className="py-3 px-4 text-sm">{user.email}</td>
                    <td className="py-3 px-4 text-sm">{user.address}</td>
                    <td className="py-3 px-4 text-sm">{user.cellphoneNumber}</td>
                    <td className="py-3 px-4 flex space-x-2">
                      <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded text-sm">
                        Editar
                      </button>
                      <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
