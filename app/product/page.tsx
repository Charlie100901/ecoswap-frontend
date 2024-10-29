"use client";
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Product {
    id: number; 
    title: string;
    description: string;
    imageProduct?: string; 
}

export default function Page() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [page, setPage] = useState<number>(0); 
    const [size, setSize] = useState<number>(9); 
    const [totalPages, setTotalPages] = useState<number>(0); 

    const categories = [
        "Electrónica y Tecnología",
        "Hogar y Muebles",
        "Juguetes y Accesorios",
        "Libros y Entretenimiento",
        "Deportes y Aire Libre",
        "Ropa y Accesorios",
        "Mascotas",
        "Oficina y Papelería",
        "Salud y Belleza",
        "Joyería y Relojes"
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const url = selectedCategory 
                    ? `http://localhost:8080/api/v1/product/category/${selectedCategory}?page=${page}&size=${size}` 
                    : `http://localhost:8080/api/v1/product?page=${page}&size=${size}`;
                    
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Error al cargar los productos');
                }
                const data = await response.json();
                setProducts(data.products); 
                setTotalPages(data.totalPages); 
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts(); 
    }, [selectedCategory, page, size]); 

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen dark:bg-zinc-800">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 mb-4 "></div>
                <p className="text-lg text-gray-700">Cargando productos...</p>
            </div>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='dark:bg-zinc-800'>
            <Header />
            <div className="container mx-auto p-4 mb-[100px] mt-6">
                <h1 className="text-center text-3xl font-bold mb-6 dark:text-white">ENCUENTRA LO QUE NECESITAS</h1>

                <div className="flex flex-col md:flex-row">
                    <aside className="md:w-1/4 p-4 bg-[#F4F4F4] dark:bg-zinc-800 rounded-lg shadow-lg mb-4 md:mb-0">
                        <h3 className="font-bold text-lg mb-4 dark:text-gray-300">Categorías</h3>
                        <ul className="space-y-2">
                            <li>
                                <button
                                    onClick={() => { setSelectedCategory(null); setPage(0); }} 
                                    className="text-left w-full text-gray-900 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded"
                                >
                                    Todas
                                </button>
                            </li>
                            {categories.map((category) => (
                                <li key={category}>
                                    <button
                                        onClick={() => { setSelectedCategory(category); setPage(0); }} 
                                        className="text-left w-full text-gray-900 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded"
                                    >
                                        {category}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </aside>

                    <main className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product, index) => (
                                <div
                                    key={product.id}
                                    className={`bg-white dark:hover:shadow-lg dark:hover:bg-gray-900 dark:hover:shadow-lime-400 dark:bg-neutral-800 border border-gray-200 rounded-lg shadow-lg p-4 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl 
                                                opacity-0 translate-y-4 animate-[fade-in-up_0.5s_ease-out_forwards] 
                                                ${index < 3 ? 'animate-delay-[0ms]' : index < 6 ? 'animate-delay-[200ms]' : 'animate-delay-[400ms]'}`}
                                >
                                    <a href="#">
                                        <Image
                                            className="rounded-lg max-h-[250px] min-h-[250px] w-full object-cover"
                                            src={product.imageProduct || '/img/default-product.jpeg'}
                                            alt={product.title}
                                            width={340}
                                            height={300}
                                        />
                                    </a>
                                    <h3 className="text-xl font-bold mt-4 dark:text-white uppercase">{product.title}</h3>
                                    <p className="text-sm text-gray-700 mt-2 dark:text-white">{product.description}</p>
                                    <a
                                        href={`/product/${product.id}`}
                                        className="inline-flex mt-4 items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg transition-all duration-300 ease-in-out hover:bg-blue-800 hover:translate-x-1 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    >
                                        Más información
                                        <svg
                                            className="rtl:rotate-180 w-3.5 h-3.5 ms-2 transition-transform duration-300 ease-in-out hover:translate-x-1"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 14 10"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M1 5h12m0 0L9 1m4 4L9 9"
                                            />
                                        </svg>
                                    </a>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center mt-6">
                            <button 
                                onClick={() => setPage(page > 0 ? page - 1 : 0)} 
                                disabled={page === 0} 
                                className="bg-gray-300 text-gray-700 rounded px-4 py-2 disabled:opacity-50"
                            >
                                Anterior
                            </button>
                            <span className='dark:text-white'>Página {page + 1} de {totalPages}</span>
                            <button 
                                onClick={() => setPage(page < totalPages - 1 ? page + 1 : totalPages - 1)} 
                                disabled={page === totalPages - 1} 
                                className="bg-gray-300 text-gray-700 rounded px-4 py-2 disabled:opacity-50"
                            >
                                Siguiente
                            </button>
                        </div>
                    </main>
                </div>
            </div>
            <Footer />
        </div>
    );
}
