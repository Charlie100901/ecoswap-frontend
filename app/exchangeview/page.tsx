'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useChat } from '../hooks/useChat';
import config from '@/config';

interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  conditionProduct: string;
  imageProduct: string;
  releaseDate: string;
  user: { id: number; name: string };
}

const getLocalStorage = (key: string) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

export default function ExchangeView() {
  const [exchangeProduct, setExchangeProduct] = useState<{ productFrom: Product; productTo: Product; id: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCancelExchange = async () => {
    try {
      const token = getLocalStorage("token");
      const response = await fetch(`${config.apiBaseUrl}/api/v1/${exchangeId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al cancelar el intercambio');
      }

      router.push('/profile');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleProductReceived = async () => {
    try {
      const token = getLocalStorage("token");

      const response = await fetch(`${config.apiBaseUrl}/api/v1/${exchangeId}/confirm`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al confirmar la recepción del producto');
      }

      const confirmedExchange = await response.json();
      router.push('/profile');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  useEffect(() => {
    const storedExchangeProduct = getLocalStorage('exchangeProduct');
    if (storedExchangeProduct) {
      setExchangeProduct(JSON.parse(storedExchangeProduct));
    } else {
      setError('No se encontró información del intercambio. Regrese a la página anterior o seleccione un producto.');
    }
  }, []);

  const senderId = exchangeProduct?.productFrom.user.id || 0;
  const receiverId = exchangeProduct?.productTo.user.id || 0;
  const exchangeId = exchangeProduct?.id || 0;

  const { messages, sendMessage, loading, error: chatError } = useChat(senderId, receiverId, exchangeId);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-zinc-800">
        <h1 className="text-red-500 text-xl font-semibold">{error}</h1>
        <button
          onClick={() => router.back()}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Volver
        </button>
      </div>
    );
  }

  if (!exchangeProduct) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-zinc-800">
        <p className="text-lg text-gray-700 dark:text-gray-300">Cargando información del intercambio...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-zinc-800">
      <Header />
      <main className="flex-grow container mx-auto p-6">
        <h1 className="text-center text-3xl font-bold mb-8 text-gray-800 dark:text-white">
          Intercambio en Proceso
        </h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Columna izquierda - Productos */}
          <div className="lg:w-1/2 space-y-8">
            {/* Producto ofrecido */}
            <div className="border p-4 rounded-lg bg-white dark:bg-zinc-700 shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Producto Ofrecido</h2>
              <div className="flex flex-col md:flex-row gap-4">
                <Image
                  src={exchangeProduct.productFrom.imageProduct}
                  alt={exchangeProduct.productFrom.title}
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
                <div className="flex flex-col">
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Título:</strong> {exchangeProduct.productFrom.title}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Descripción:</strong> {exchangeProduct.productFrom.description}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Estado:</strong> {exchangeProduct.productFrom.conditionProduct}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Publicado por:</strong> {exchangeProduct.productFrom.user.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Producto aceptado */}
            <div className="border p-4 rounded-lg bg-white dark:bg-zinc-700 shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Producto Aceptado</h2>
              <div className="flex flex-col md:flex-row gap-4">
                <Image
                  src={exchangeProduct.productTo.imageProduct}
                  alt={exchangeProduct.productTo.title}
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
                <div className="flex flex-col">
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Título:</strong> {exchangeProduct.productTo.title}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Descripción:</strong> {exchangeProduct.productTo.description}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Estado:</strong> {exchangeProduct.productTo.conditionProduct}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Publicado por:</strong> {exchangeProduct.productTo.user.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="space-y-6">
              {/* Card de Cancelar Intercambio */}
              <div className="bg-white dark:bg-zinc-700 p-4 rounded-lg shadow-md">
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <p>
                    <span className="font-medium">Cancelar Intercambio:</span> Si por alguna razón no puedes completar el intercambio, 
                    puedes cancelarlo. Esto notificará al otro usuario y finalizará el proceso.
                  </p>
                </div>
                <button
                  onClick={handleCancelExchange}
                  className="w-full mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Cancelar Intercambio
                </button>
              </div>

              {/* Card de Producto Recibido */}
              <div className="bg-white dark:bg-zinc-700 p-4 rounded-lg shadow-md">
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <p>
                    <span className="font-medium">Producto Recibido:</span> Una vez que hayas recibido el producto del otro usuario, 
                    marca esta opción para confirmar que el intercambio se ha completado exitosamente.
                  </p>
                </div>
                <button
                  onClick={handleProductReceived}
                  className="w-full mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Producto Recibido
                </button>
              </div>
            </div>
          </div>

          {/* Columna derecha - Chat */}
          <div className="lg:w-1/2">
            <div className="border p-4 rounded-lg bg-white dark:bg-zinc-700 shadow-md h-full">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Chat de Intercambio</h2>
              
              {/* Mensaje informativo */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  Este chat está diseñado para que puedas contactar al otro usuario y acordar los detalles de la entrega de los productos. 
                  Por favor, coordina:
                </p>
                <ul className="list-disc list-inside text-blue-800 dark:text-blue-200 text-sm mt-2">
                  <li>Lugar y fecha de encuentro</li>
                  <li>Método de entrega</li>
                  <li>Cualquier detalle adicional sobre el estado de los productos</li>
                </ul>
              </div>

              {/* Área de mensajes */}
              <div className="h-[400px] overflow-y-auto bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg mb-4">
                {loading ? (
                  <p className="text-gray-700 dark:text-gray-300">Cargando mensajes...</p>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`mb-2 flex ${
                        msg.senderId === senderId ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          msg.senderId === senderId
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-600 text-black dark:text-white'
                        } max-w-[70%]`}
                      >
                        <p>{msg.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input de mensaje */}
              <input
                type="text"
                placeholder="Escribe un mensaje..."
                className="w-full p-2 border rounded-lg bg-gray-100 dark:bg-zinc-800 dark:text-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
                    sendMessage(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}