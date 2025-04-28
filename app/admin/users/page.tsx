'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import config from '@/config';
import Footer from '@/app/components/Footer';

interface User {
  id: number;
  name: string;
  email: string;
  address: string;
  cellphoneNumber: string;
  password: string;
}

const getLocalStorage = (key: string) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<User>({
    id: 0,
    name: '',
    email: '',
    address: '',
    cellphoneNumber: '',
    password: ''
  });
  const [searchTerm, setSearchTerm] = useState<string>('');

  const router = useRouter();

  const fetchUsers = async () => {
    try {
      const token = getLocalStorage('token');

      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch(`${config.apiBaseUrl}/api/v1/user`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
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

  const handleSave = async () => {
    const url = isEditing
      ? `${config.apiBaseUrl}/api/v1/user/${currentUser?.id}`
      : `${config.apiBaseUrl}/api/v1/user`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const token = getLocalStorage('token');

      if (!token) throw new Error('No se encontró el token de autenticación');

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al guardar el usuario');
      }

      setModalOpen(false);
      fetchUsers();
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = getLocalStorage('token');

      if (!token) throw new Error('No se encontró el token de autenticación');

      const response = await fetch(`${config.apiBaseUrl}/api/v1/user/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el usuario');
      }

      fetchUsers();
    } catch (error) {
      setError((error as Error).message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openModal = (user?: User) => {
    setIsEditing(!!user);
    setCurrentUser(user || null);
    setFormData(
      user || { id: 0, name: '', email: '', address: '', cellphoneNumber: '', password: '' }
    );
    setModalOpen(true);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Header />
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 mb-4"></div>
        <p className="text-lg text-gray-700">Cargando usuarios...</p>
        <Footer />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-4">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-800 ">
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-center text-2xl font-bold mt-6 mb-8 text-gray-800 dark:text-white animate-fade-down">
          Panel de Usuarios
        </h1>

        <button
          onClick={() => openModal()}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          Crear Usuario Nuevo
        </button>

        <input
          type="text"
          placeholder="Buscar por nombre o correo"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 rounded-lg shadow">
            <thead>
              <tr className="bg-blue-100 dark:bg-zinc-600 border-b-2 border-blue-200 dark:border-zinc-500">
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-800 dark:text-white">id</th>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-800 dark:text-white">Nombre</th>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-800 dark:text-white">Correo Electrónico</th>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-800 dark:text-white">Dirección</th>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-800 dark:text-white">Teléfono</th>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-800 dark:text-white">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500 dark:text-gray-400">
                    No hay usuarios disponibles
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b dark:border-zinc-600">
                    <td className="py-3 px-4 text-sm text-gray-800 dark:text-white">{user.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-800 dark:text-white">{user.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-800 dark:text-white">{user.email}</td>
                    <td className="py-3 px-4 text-sm text-gray-800 dark:text-white">{user.address}</td>
                    <td className="py-3 px-4 text-sm text-gray-800 dark:text-white">{user.cellphoneNumber}</td>
                    <td className="py-3 px-4 flex space-x-2">
                      <button
                        onClick={() => openModal(user)}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm"
                      >
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-90 z-50 flex justify-center items-center">
          <div className="bg-white dark:bg-zinc-700 p-6 rounded shadow-lg w-full max-w-md mx-4">
            <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
              {isEditing ? 'Editar Usuario' : 'Crear Usuario'}
            </h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-white">Nombre</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 dark:border-zinc-600 rounded px-3 py-2 bg-gray-50 dark:bg-zinc-800 text-gray-800 dark:text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-white">Correo Electrónico</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-gray-300 dark:border-zinc-600 rounded px-3 py-2 bg-gray-50 dark:bg-zinc-800 text-gray-800 dark:text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-white">Contraseña</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full border border-gray-300 dark:border-zinc-600 rounded px-3 py-2 bg-gray-50 dark:bg-zinc-800 text-gray-800 dark:text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-white">Dirección</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full border border-gray-300 dark:border-zinc-600 rounded px-3 py-2 bg-gray-50 dark:bg-zinc-800 text-gray-800 dark:text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-white">Teléfono</label>
                <input
                  type="text"
                  value={formData.cellphoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, cellphoneNumber: e.target.value })
                  }
                  className="w-full border border-gray-300 dark:border-zinc-600 rounded px-3 py-2 bg-gray-50 dark:bg-zinc-800 text-gray-800 dark:text-white"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
