'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import config from '@/config';

interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  conditionProduct: string;
  productStatus: string;
}

interface ApiResponse {
  products: Product[]; 
}

const getLocalStorage = (key: string) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterCondition, setFilterCondition] = useState<string>('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = getLocalStorage('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        const response = await fetch(`${config.apiBaseUrl}/api/v1/product`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los productos');
        }

        const data: ApiResponse = await response.json();
        setProducts(data.products);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async () => {
    if (productToDelete === null) return;

    try {
      const token = getLocalStorage('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch(`${config.apiBaseUrl}/api/v1/product/${productToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el producto');
      }

      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productToDelete));
      setShowModal(false); 
    } catch (error) {
      alert((error as Error).message);
    }
  };

  const openModal = (id: number) => {
    setProductToDelete(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setProductToDelete(null);
  };

  const filteredProducts = products.filter(product =>
    (product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterCategory ? product.category === filterCategory : true) &&
    (filterCondition ? product.conditionProduct === filterCondition : true)
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 mb-4"></div>
        <p className="text-lg text-gray-700">Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-4">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-800">
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-center text-2xl font-bold mb-8 text-gray-800 dark:text-white animate-fade-down mt-6">
          Panel de Productos
        </h1>

        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <input
            type="text"
            placeholder="Buscar por título o descripción"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-3 border border-gray-300 dark:border-zinc-600 rounded-lg w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 dark:bg-zinc-800 text-gray-800 dark:text-white shadow"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="p-3 border border-gray-300 dark:border-zinc-600 rounded-lg w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 dark:bg-zinc-800 text-gray-800 dark:text-white shadow"
          >
            <option value="">Todas las Categorías</option>
            <option value="Electrónica y Tecnología">Electrónica y Tecnología</option>
            <option value="Hogar y Muebles">Hogar y Muebles</option>
            <option value="Libros y Entretenimiento">Libros y Entretenimiento</option>
            <option value="Mascotas">Mascotas</option>
            <option value="Ropa y Accesorios">Ropa y Accesorios</option>
            <option value="Deportes y Aire Libre">Deportes y Aire Libre</option>
          </select>
          <select
            value={filterCondition}
            onChange={(e) => setFilterCondition(e.target.value)}
            className="p-3 border border-gray-300 dark:border-zinc-600 rounded-lg w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50 dark:bg-zinc-800 text-gray-800 dark:text-white shadow"
          >
            <option value="">Todas las Condiciones</option>
            <option value="nuevo">Nuevo</option>
            <option value="usado">Usado</option>
          </select>
        </div>

        <div className="overflow-x-auto flex justify-center">
          <div className="w-full max-w-5xl">
            <table className="min-w-full bg-white dark:bg-zinc-800 border-separate border-spacing-0 rounded-xl shadow-xl">
              <thead className="sticky top-0 z-10">
                <tr className="bg-gradient-to-r from-green-500 to-blue-500 dark:from-zinc-700 dark:to-zinc-600 text-white">
                  <th className="py-3 px-5 text-left text-sm font-bold rounded-tl-xl">Título</th>
                  <th className="py-3 px-5 text-left text-sm font-bold">Descripción</th>
                  <th className="py-3 px-5 text-left text-sm font-bold">Categoría</th>
                  <th className="py-3 px-5 text-left text-sm font-bold">Condición</th>
                  <th className="py-3 px-5 text-left text-sm font-bold rounded-tr-xl">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500 dark:text-gray-400">
                      No hay productos disponibles
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product, idx) => (
                    <tr
                      key={product.id}
                      className={`transition-colors duration-200 ${
                        idx % 2 === 0
                          ? 'bg-gray-50 dark:bg-zinc-700'
                          : 'bg-white dark:bg-zinc-800'
                      } hover:bg-green-50 dark:hover:bg-zinc-600`}
                    >
                      <td className="py-3 px-5 text-sm text-gray-800 dark:text-white border-b border-gray-200 dark:border-zinc-700">
                        {product.title}
                      </td>
                      <td className="py-3 px-5 text-sm text-gray-800 dark:text-white border-b border-gray-200 dark:border-zinc-700 whitespace-normal break-words max-w-prose">
                        {product.description}
                      </td>
                      <td className="py-3 px-5 text-sm text-gray-800 dark:text-white border-b border-gray-200 dark:border-zinc-700">
                        {product.category}
                      </td>
                      <td className="py-3 px-5 text-sm text-gray-800 dark:text-white border-b border-gray-200 dark:border-zinc-700">
                        {product.conditionProduct}
                      </td>
                      <td className="py-3 px-5 flex space-x-2 border-b border-gray-200 dark:border-zinc-700">
                        <button
                          onClick={() => openModal(product.id)}
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

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-zinc-700 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Confirmar Eliminación</h2>
            <p className="text-gray-800 dark:text-white">¿Estás seguro de que deseas eliminar este producto?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={closeModal}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}