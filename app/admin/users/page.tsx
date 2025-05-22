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
        <h1 className="text-center items-center text-2xl font-bold mt-6 mb-8 text-gray-800 dark:text-white animate-fade-down">
          Panel de Usuarios
        </h1>
    <div className="flex flex-col items-center mb-8">

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
          className="mb-8 p-3 border border-gray-300 dark:border-zinc-600 rounded-lg w-full max-w-md mx-auto focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 dark:bg-zinc-800 text-gray-800 dark:text-white shadow transition-all duration-200"
        />
    </div>

        <div className="overflow-x-auto flex justify-center">
          <div className="w-full max-w-5xl">
            <table className="min-w-full bg-white dark:bg-zinc-800 border-separate border-spacing-0 rounded-xl shadow-xl">
              <thead className="sticky top-0 z-10">
                <tr className="bg-gradient-to-r from-green-500 to-blue-500 dark:from-zinc-700 dark:to-zinc-600 text-white">
                  <th className="py-3 px-5 text-left text-sm font-bold rounded-tl-xl">ID</th>
                  <th className="py-3 px-5 text-left text-sm font-bold">Nombre</th>
                  <th className="py-3 px-5 text-left text-sm font-bold">Correo Electrónico</th>
                  <th className="py-3 px-5 text-left text-sm font-bold">Dirección</th>
                  <th className="py-3 px-5 text-left text-sm font-bold">Teléfono</th>
                  <th className="py-3 px-5 text-left text-sm font-bold rounded-tr-xl">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-500 dark:text-gray-400">
                      No hay usuarios disponibles
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, idx) => (
                    <tr
                      key={user.id}
                      className={`transition-colors duration-200 ${
                        idx % 2 === 0
                          ? 'bg-gray-50 dark:bg-zinc-700'
                          : 'bg-white dark:bg-zinc-800'
                      } hover:bg-green-50 dark:hover:bg-zinc-600`}
                    >
                      <td className="py-3 px-5 text-sm text-gray-800 dark:text-white border-b border-gray-200 dark:border-zinc-700">
                        {user.id}
                      </td>
                      <td className="py-3 px-5 text-sm text-gray-800 dark:text-white border-b border-gray-200 dark:border-zinc-700">
                        {user.name}
                      </td>
                      <td className="py-3 px-5 text-sm text-gray-800 dark:text-white border-b border-gray-200 dark:border-zinc-700">
                        {user.email}
                      </td>
                      <td className="py-3 px-5 text-sm text-gray-800 dark:text-white border-b border-gray-200 dark:border-zinc-700">
                        {user.address}
                      </td>
                      <td className="py-3 px-5 text-sm text-gray-800 dark:text-white border-b border-gray-200 dark:border-zinc-700">
                        {user.cellphoneNumber}
                      </td>
                      <td className="py-3 px-5 flex space-x-2 border-b border-gray-200 dark:border-zinc-700">
                        <button
                          onClick={() => openModal(user)}
                          className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-bold py-1 px-4 rounded shadow transition-all duration-150"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-bold py-1 px-4 rounded shadow transition-all duration-150"
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
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-90 z-50 flex justify-center items-center">
          <div className="animate-fade-in-up bg-white dark:bg-zinc-700 p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4 transition-all duration-300 scale-95 opacity-0 animate-modal-in">
            <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white text-center">
              {isEditing ? 'Editar Usuario' : 'Crear Usuario'}
            </h2>
            <form>
              <div className="mb-5">
                <label className="block text-sm font-semibold mb-2 text-gray-800 dark:text-white">Nombre</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 dark:border-zinc-600 rounded-lg px-4 py-2 bg-gray-50 dark:bg-zinc-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                />
              </div>
              <div className="mb-5">
                <label className="block text-sm font-semibold mb-2 text-gray-800 dark:text-white">Correo Electrónico</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-gray-300 dark:border-zinc-600 rounded-lg px-4 py-2 bg-gray-50 dark:bg-zinc-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                />
              </div>
              <div className="mb-5">
                <label className="block text-sm font-semibold mb-2 text-gray-800 dark:text-white">Contraseña</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full border border-gray-300 dark:border-zinc-600 rounded-lg px-4 py-2 bg-gray-50 dark:bg-zinc-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                />
              </div>
              <div className="mb-5">
                <label className="block text-sm font-semibold mb-2 text-gray-800 dark:text-white">Dirección</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full border border-gray-300 dark:border-zinc-600 rounded-lg px-4 py-2 bg-gray-50 dark:bg-zinc-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                />
              </div>
              <div className="mb-8">
                <label className="block text-sm font-semibold mb-2 text-gray-800 dark:text-white">Teléfono</label>
                <input
                  type="text"
                  value={formData.cellphoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, cellphoneNumber: e.target.value })
                  }
                  className="w-full border border-gray-300 dark:border-zinc-600 rounded-lg px-4 py-2 bg-gray-50 dark:bg-zinc-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-5 rounded-lg transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-bold py-2 px-5 rounded-lg shadow transition-all"
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

// Animación para el modal (agrega esto a tu CSS global o tailwind.config.js si usas Tailwind)
// @layer utilities {
//   .animate-modal-in {
//     animation: modalIn 0.3s cubic-bezier(0.4,0,0.2,1) forwards;
//   }
//   @keyframes modalIn {
//     0% { opacity: 0; transform: translateY(40px) scale(0.95); }
//     100% { opacity: 1; transform: translateY(0) scale(1); }
//   }
// }
