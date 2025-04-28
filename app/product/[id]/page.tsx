'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useRouter } from 'next/navigation';
import config from '@/config';
import { X } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    address: string;
}

interface Product {
    id: number;
    title: string;
    description: string;
    category: string;
    productStatus: string;
    conditionProduct: string;
    imageProduct: string;
    releaseDate: string;
    user: User;
}

interface ExchangeProduct {
    id: number;
    productFrom: Product;
    productTo: Product;
    status: string;
    exchangeRequestedAt: string;
    exchangeRespondedAt: string;
}

const getLocalStorage = (key: string) => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  };
  

export default function Page({ params }: { params: { id: string } }) {
    const { id } = params;
    const [product, setProduct] = useState<Product | null>(null);
    const [exchangeProducts, setExchangeProducts] = useState<ExchangeProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [fadeIn, setFadeIn] = useState<boolean>(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [selectedExchange, setSelectedExchange] = useState<ExchangeProduct | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchProductDetail = async () => {
            if (!id) return;
            try {
                const response = await fetch(`${config.apiBaseUrl}/api/v1/product/${id}`);
                if (!response.ok) {
                    throw new Error('Error al cargar el producto');
                }
                const data: Product = await response.json();
                console.log(data);
                setProduct(data);
                setFadeIn(true);
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetail();
    }, [id]);

    useEffect(() => {
        const fetchExchangeProducts = async () => {
            if (!product) return;

            try {
                const response = await fetch(`${config.apiBaseUrl}/api/v1/exchanges`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(product), 
                });

                if (!response.ok) {
                    throw new Error('Error al cargar los productos disponibles para intercambio');
                }

                const data: ExchangeProduct[] = await response.json();
                setExchangeProducts(data);
            } catch (error) {
                setError((error as Error).message);
            }
        };

        if (product) {
            fetchExchangeProducts();
        }
    }, [product]);

    const handleExchangeRequest = async (exchangeProduct: ExchangeProduct) => {
        setSelectedExchange(exchangeProduct);
        setShowConfirmationModal(true);
    };

    const confirmExchange = async () => {
        if (!selectedExchange) return;

        try {
            const token = getLocalStorage('token');
            const response = await fetch(`${config.apiBaseUrl}/api/v1/select-exchange`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: selectedExchange.id,
                    productFrom: { id: product?.id },
                }),
            });
    
            if (!response.ok) {
                throw new Error('Error al solicitar el intercambio');
            }
    
            const result = await response.json();
    
            // Save exchange details in local storage
            localStorage.setItem('exchangeProduct', JSON.stringify({
                id: selectedExchange.id,
                productFrom: product,
                productTo: result.productFrom,
            }));
    
            setShowConfirmationModal(false);
            router.push('/exchangeview');
        } catch (error) {
            setError((error as Error).message);
            setShowConfirmationModal(false);
        }
    };

    const ConfirmationModal = () => {
        if (!showConfirmationModal || !selectedExchange) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 max-w-md w-full mx-4 relative">
                    <button 
                        onClick={() => setShowConfirmationModal(false)}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <X size={24} />
                    </button>

                    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                        Confirmar Intercambio
                    </h3>

                    <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-zinc-700 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                Detalles del Intercambio
                            </h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="text-gray-600 dark:text-gray-300">Tu Producto:</div>
                                <div className="text-gray-900 dark:text-white">{product?.title}</div>
                                <div className="text-gray-600 dark:text-gray-300">Producto a Intercambiar:</div>
                                <div className="text-gray-900 dark:text-white">{selectedExchange.productFrom.title}</div>
                            </div>
                        </div>

                        <p className="text-gray-700 dark:text-gray-300">
                            ¿Estás seguro de que deseas iniciar el proceso de intercambio?
                        </p>

                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                onClick={() => setShowConfirmationModal(false)}
                                className="px-4 py-2 bg-gray-200 dark:bg-zinc-600 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-zinc-500 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmExchange}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 mb-4"></div>
                <p className="text-lg text-gray-700">Cargando producto...</p>
            </div>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!product) {
        return <div>No se encontró el producto.</div>;
    }

    const handleIntercambio = () => {
        router.push(`/UploadProduct?productTo=${product.id}`);
    };

    return (
        <div className={`transition-opacity duration-700 dark:bg-zinc-800 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
            <Header />
            <div className="max-w-[1300px] mx-auto p-6 mb-[50px]">
                <h1 className="text-3xl font-bold text-center mb-6 dark:text-white">VER PRODUCTO</h1>
                <div className="flex flex-col md:flex-row justify-center items-start space-y-8 md:space-y-0 md:space-x-8">
                    <div className="flex flex-col space-y-4">
                        {[1, 2, 3].map((index) => (
                            <Image
                                key={index}
                                src={product.imageProduct || '/img/default-product.jpeg'}
                                alt={`Producto ${index}`}
                                width={80}
                                height={80}
                                className="rounded-md cursor-pointer hover:scale-105 transition-transform"
                            />
                        ))}
                    </div>

                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-9">
                        <Image
                            src={product.imageProduct || '/img/default-product.jpeg'}
                            alt="Main Product Image"
                            width={600}
                            height={600}
                            className="rounded-md"
                        />
                        <div className="flex flex-col space-y-4">
                            <h2 className="text-2xl font-bold text-green-600 uppercase">{product.title}</h2>
                            <p className="text-[#4F3527] dark:text-white whitespace-normal break-words max-w-prose">
                                {product.description}
                            </p>          
                            <ul className="space-y-2">
                                <li className='dark:text-white'>
                                    <span className="font-bold dark:text-white">🟢 Estado:</span> {product.conditionProduct}
                                </li>
                                <li className='dark:text-white'>
                                    <span className="font-bold">📂 Categoría:</span> {product.category}
                                </li>
                                <li className='dark:text-white'>
                                    <span className="font-bold">📅 Fecha de publicación:</span> {product.releaseDate}
                                </li>
                                <li className='dark:text-white'>
                                    <span className="font-bold">👤 Publicado por:</span> {product.user?.name}
                                </li>
                            </ul>
                            <button 
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                onClick={handleIntercambio}
                            >
                                Pedir Intercambio
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-4 dark:text-white">Productos Disponibles para Intercambio</h2>
                    {exchangeProducts.length === 0 ? (
                        <p className='dark:text-white'>No hay productos disponibles para intercambio.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {exchangeProducts.map((exchange) => (
                                <div key={exchange.id} className="flex flex-col p-4 border rounded-md bg-gray-200 dark:bg-zinc-700">
                                    <Image
                                        src={exchange.productFrom?.imageProduct || '/img/default-product.jpeg'}
                                        alt={exchange.productFrom?.title || 'Producto'}
                                        width={120}
                                        height={120}
                                        className="rounded-md mb-4"
                                    />
                                    <div className="flex flex-col flex-grow">
                                        <h3 className="text-xl font-bold mb-2 dark:text-white">
                                            {exchange.productFrom?.title || 'Producto desconocido'}
                                        </h3>
                                        <ul className="text-sm space-y-1 mb-4">
                                            <li className='dark:text-white'>
                                                <span className="font-bold">Estado:</span> {exchange.productFrom?.conditionProduct || 'No especificado'}
                                            </li>
                                            <li className='dark:text-white'>
                                                <span className="font-bold">Categoría:</span> {exchange.productFrom?.category || 'No especificada'}
                                            </li>
                                            <li className='dark:text-white'>
                                                <span className="font-bold">Publicado por:</span> {exchange.productFrom?.user?.name || 'Usuario desconocido'}
                                            </li>
                                        </ul>
                                        <button 
                                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors mt-auto"
                                            onClick={() => handleExchangeRequest(exchange)}
                                        >
                                            Intercambiar
                                        </button>
                                    </div>
                                    <span className="text-gray-500 text-xs dark:text-white mt-2">
                                        Publicado el {new Date(exchange.exchangeRequestedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
            <ConfirmationModal />
        </div>
    );
}
