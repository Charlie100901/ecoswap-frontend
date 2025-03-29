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
  user: { id: number; name: string }; // Incluye el ID del usuario
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

  // Define valores predeterminados para evitar llamadas condicionales al hook
  const senderId = exchangeProduct?.productFrom.user.id || 0;
  const receiverId = exchangeProduct?.productTo.user.id || 0;
  const exchangeId = exchangeProduct?.productFrom.id || 0;  

  // Llama al hook useChat fuera de cualquier condición
  const { messages, sendMessage, loading, error: chatError } = useChat(senderId, receiverId, exchangeId);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-red-500">{error}</h1>
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
    return <div className="flex justify-center items-center h-screen">Cargando información del intercambio...</div>;
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="flex justify-center text-3xl font-bold mb-4">Intercambio en Proceso!</h1>
        <div className="flex justify-center space-x-8">
          {/* Producto ofrecido */}
          <div className="border p-4 rounded-lg bg-gray-100 dark:bg-zinc-800">
            <h2 className="text-2xl font-semibold">Producto Ofrecido</h2>
            <Image src={exchangeProduct.productFrom.imageProduct} alt={exchangeProduct.productFrom.title} width={300} height={300} />
            <p><strong>Título:</strong> {exchangeProduct.productFrom.title}</p>
            <p><strong>Descripción:</strong> {exchangeProduct.productFrom.description}</p>
            <p><strong>Estado:</strong> {exchangeProduct.productFrom.conditionProduct}</p>
            <p><strong>Publicado por:</strong> {exchangeProduct.productFrom.user.name}</p>
          </div>

          {/* Producto aceptado */}
          <div className="border p-4 rounded-lg bg-gray-100 dark:bg-zinc-800">
            <h2 className="text-2xl font-semibold">Producto Aceptado</h2>
            <Image src={exchangeProduct.productTo.imageProduct} alt={exchangeProduct.productTo.title} width={300} height={300} />
            <p><strong>Título:</strong> {exchangeProduct.productTo.title}</p>
            <p><strong>Descripción:</strong> {exchangeProduct.productTo.description}</p>
            <p><strong>Estado:</strong> {exchangeProduct.productTo.conditionProduct}</p>
            <p><strong>Publicado por:</strong> {exchangeProduct.productTo.user.name}</p>
          </div>
        </div>

        {/* Chat */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold">Chat</h2>
          <div className="border p-4 rounded-lg bg-gray-100 dark:bg-zinc-800">
            <div className="h-64 overflow-y-auto">
              {loading ? (
                <p>Cargando mensajes...</p>
              ) : (
                messages.map((msg, index) => (
                  <div key={index} className="mb-2">
                    <strong>{msg.senderId === senderId ? "Tú" : "Ellos"}:</strong> {msg.content}
                  </div>
                ))
              )}
            </div>
            <input
              type="text"
              placeholder="Escribe un mensaje..."
              className="w-full p-2 mt-2 border rounded"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage(e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}