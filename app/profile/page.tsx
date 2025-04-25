'use client';
import { useState, useEffect } from "react";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import config from '@/config';
import { useRouter } from 'next/navigation';

interface Product {
    id: number;
    title: string;
    description: string;
    imageProduct?: string;
}

interface Exchange {
    id: number;
    productFrom: {
        id: number;
        title: string;
        imageProduct: string;
        user: {
            name: string;
        };
    };
    productTo: {
        id: number;
        title: string;
        imageProduct: string;
        user: {
            name: string;
        };
    };
    status: string;
    exchangeRequestedAt: string;
}

export default function Page() {
    const [products, setProducts] = useState<Product[]>([]);
    const [exchanges, setExchanges] = useState<Exchange[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                const userId = localStorage.getItem("userId");

                // Fetch products
                const productsResponse = await fetch(`${config.apiBaseUrl}/api/v1/product/user`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!productsResponse.ok) {
                    throw new Error('Error al cargar los productos del usuario');
                }
                const productsData = await productsResponse.json();
                setProducts(productsData);

                // Fetch exchanges
                const exchangesResponse = await fetch(`${config.apiBaseUrl}/api/v1/completed/user/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!exchangesResponse.ok) {
                    throw new Error('Error al cargar los intercambios del usuario');
                }
                const exchangesData = await exchangesResponse.json();
                setExchanges(exchangesData);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleViewExchange = (exchange: Exchange) => {
        localStorage.setItem('exchangeProduct', JSON.stringify({
            id: exchange.id,
            productFrom: exchange.productFrom,
            productTo: exchange.productTo
        }));
        router.push('/exchangeview');
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-zinc-800">
            <Header />
            <main className="flex-grow mb-9 mx-4 sm:mx-8 lg:mx-32 p-4 mt-6">
                <h1 className="text-center text-3xl font-bold mb-6 text-gray-800 dark:text-white">Gestión del Perfil</h1>

                {/* Sección de Productos */}
                <div className="bg-white dark:bg-zinc-700 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 flex flex-col my-2">
                    <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Tus productos publicados</h2>
                    {loading ? (
                        <p className="text-center text-gray-500 dark:text-gray-400">Cargando productos...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : products.length === 0 ? (
                        <p className="text-center text-gray-500 dark:text-gray-400">No has publicado ningún producto.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <Link href={"/product/" + product.id} key={product.id} className="block transform transition-transform duration-300 hover:scale-105">
                                    <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-600 rounded-lg shadow-lg p-4 w-full h-full">
                                        <div className="relative w-full h-[200px] mb-4">
                                            <Image
                                                className="rounded-lg object-cover"
                                                src={product.imageProduct || '/img/default-product.jpeg'}
                                                alt={product.title}
                                                layout="fill"
                                            />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">{product.title}</h3>
                                        <p className="text-gray-500 dark:text-gray-400 mt-2 whitespace-normal break-words">
                                            {product.description}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sección de Intercambios */}
                <div className="bg-white dark:bg-zinc-700 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 flex flex-col my-2">
                    <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Tus intercambios en proceso</h2>
                    {loading ? (
                        <p className="text-center text-gray-500 dark:text-gray-400">Cargando intercambios...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : exchanges.length === 0 ? (
                        <p className="text-center text-gray-500 dark:text-gray-400">No tienes intercambios en proceso.</p>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {exchanges.map((exchange) => (
                                <div 
                                    key={exchange.id} 
                                    className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-600 rounded-lg shadow-lg p-4"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Producto Ofrecido */}
                                        <div className="flex items-center space-x-4">
                                            <div className="relative w-20 h-20">
                                                <Image
                                                    src={exchange.productFrom.imageProduct || '/img/default-product.jpeg'}
                                                    alt={exchange.productFrom.title}
                                                    layout="fill"
                                                    className="rounded-lg object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800 dark:text-white">
                                                    {exchange.productFrom.title}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Por: {exchange.productFrom.user.name}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Producto Aceptado */}
                                        <div className="flex items-center space-x-4">
                                            <div className="relative w-20 h-20">
                                                <Image
                                                    src={exchange.productTo.imageProduct || '/img/default-product.jpeg'}
                                                    alt={exchange.productTo.title}
                                                    layout="fill"
                                                    className="rounded-lg object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800 dark:text-white">
                                                    {exchange.productTo.title}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Por: {exchange.productTo.user.name}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mt-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            exchange.status === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                            exchange.status === 'completado' ? 'bg-green-100 text-green-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {exchange.status}
                                        </span>
                                        <button
                                            onClick={() => handleViewExchange(exchange)}
                                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                                        >
                                            Ver Detalles
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
