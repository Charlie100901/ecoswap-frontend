'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Product {
    id: number;
    title: string;
    description: string;
    category: string;
    conditionProduct: string;
    imageProduct: string;
    releaseDate: string;
    user: { name: string };
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
        <div className=''>
            <Header />
            <div className=" container mx-auto p-6">
                <h1 className="flex justify-center text-3xl font-bold mb-4">Intercambio exitoso!</h1>
                <div className="flex justify-center  space-x-8">
                    {/* Product Offered */}
                    <div className="border p-4 rounded-lg bg-gray-100 dark:bg-zinc-800">
                        <h2 className="text-2xl font-semibold">Producto Ofrecido</h2>
                        <Image src={exchangeProduct.productFrom.imageProduct} alt={exchangeProduct.productFrom.title} width={300} height={300} />
                        <p><strong>Título:</strong> {exchangeProduct.productFrom.title}</p>
                        <p className='whitespace-normal break-words max-w-prose'><strong>Descripción:</strong> {exchangeProduct.productFrom.description}</p>
                        <p><strong>Estado:</strong> {exchangeProduct.productFrom.conditionProduct}</p>
                        <p><strong>Publicado por:</strong> {exchangeProduct.productTo.user.name}</p>

                    </div>

                    {/* Product Accepted */}
                    <div className="border p-4 rounded-lg bg-gray-100 dark:bg-zinc-800">
                        <h2 className="text-2xl font-semibold">Producto Aceptado</h2>
                        <Image src={exchangeProduct.productTo.imageProduct} alt={exchangeProduct.productTo.title} width={300} height={300} />
                        <p><strong>Título:</strong> {exchangeProduct.productTo.title}</p>
                        <p className='whitespace-normal break-words max-w-prose'><strong>Descripción:</strong> {exchangeProduct.productTo.description}</p>
                        <p><strong>Estado:</strong> {exchangeProduct.productTo.conditionProduct}</p>
                        <p><strong>Publicado por:</strong> {exchangeProduct.productTo.user.name}</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
