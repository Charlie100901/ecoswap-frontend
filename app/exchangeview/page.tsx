'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useChat } from '../hooks/useChat';

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

export default function ExchangeView() {
  const [exchangeProduct, setExchangeProduct] = useState<{ productFrom: Product; productTo: Product } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedExchangeProduct = localStorage.getItem('exchangeProduct');
    if (storedExchangeProduct) {
      setExchangeProduct(JSON.parse(storedExchangeProduct));
    } else {
      setError('No se encontró información del intercambio. Regrese a la página anterior o seleccione un producto.');
    }
  }, []);

  const senderId = exchangeProduct?.productFrom.user.id || 0;
  const receiverId = exchangeProduct?.productTo.user.id || 0;
  const exchangeId = exchangeProduct?.productFrom.id || 0;

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Producto ofrecido */}
          <div className="border p-4 rounded-lg bg-white dark:bg-zinc-700 shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Producto Ofrecido</h2>
            <Image
              src={exchangeProduct.productFrom.imageProduct}
              alt={exchangeProduct.productFrom.title}
              width={300}
              height={300}
              className="rounded-lg mx-auto"
            />
            <p className="mt-4 text-gray-700 dark:text-gray-300">
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

          {/* Producto aceptado */}
          <div className="border p-4 rounded-lg bg-white dark:bg-zinc-700 shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Producto Aceptado</h2>
            <Image
              src={exchangeProduct.productTo.imageProduct}
              alt={exchangeProduct.productTo.title}
              width={300}
              height={300}
              className="rounded-lg mx-auto"
            />
            <p className="mt-4 text-gray-700 dark:text-gray-300">
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

        {/* Chat */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Chat</h2>
          <div className="border p-4 rounded-lg bg-white dark:bg-zinc-700 shadow-md">
            <div className="h-64 overflow-y-auto bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg">
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
            <input
              type="text"
              placeholder="Escribe un mensaje..."
              className="w-full p-2 mt-4 border rounded-lg bg-gray-100 dark:bg-zinc-800 dark:text-white"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
                  sendMessage(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}