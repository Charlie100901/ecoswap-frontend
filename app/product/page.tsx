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
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // Para almacenar la categoría seleccionada

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
        const fetchProducts = async (category: string | null) => {
            setLoading(true);
            try {
                const url = category ? `http://localhost:8080/api/v1/product/category/${category}` : `http://localhost:8080/api/v1/product`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Error al cargar los productos');
                }
                const data: Product[] = await response.json();
                console.log(data);
                setProducts(data);
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts(selectedCategory); 
    }, [selectedCategory]); 

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mb-4"></div>
                <p className="text-lg text-gray-700">Cargando productos...</p>
            </div>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <Header />
            <div className="container mx-auto p-4">
                <h1 className="text-center text-3xl font-bold mb-6">ENCUENTRA LO QUE NECESITAS</h1>

                <div className="flex">
                    <aside className="w-1/4 p-4 bg-[#F4F4F4] rounded-lg shadow-lg">
                        <h3 className="font-bold text-lg mb-4">Categorías</h3>
                        <ul className="space-y-2">
                            <li>
                                <button
                                    onClick={() => setSelectedCategory(null)} 
                                    className="text-left w-full text-gray-900 hover:bg-gray-200 p-2 rounded"
                                >
                                    Todas
                                </button>
                            </li>
                            {categories.map((category) => (
                                <li key={category}>
                                    <button
                                        onClick={() => setSelectedCategory(category)} 
                                        className="text-left w-full text-gray-900 hover:bg-gray-200 p-2 rounded"
                                    >
                                        {category}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </aside>

                    <main className="flex-1 ml-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product, index) => (
                                <div
                                    key={product.id}
                                    className={`bg-white border border-gray-200 rounded-lg shadow-lg p-4 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl 
                                                opacity-0 translate-y-4 animate-[fade-in-up_0.5s_ease-out_forwards] 
                                                ${index < 3 ? 'animate-delay-[0ms]' : index < 6 ? 'animate-delay-[200ms]' : 'animate-delay-[400ms]'}`}
                                >
                                    <a href="#">
                                        <Image
                                            className="rounded-lg"
                                            src={product.imageProduct || '/img/default-product.jpeg'}
                                            alt={product.title}
                                            width={340}
                                            height={300}
                                            style={{ objectFit: "cover" }}
                                        />
                                    </a>
                                    <h3 className="text-xl font-bold mt-4">{product.title}</h3>
                                    <p className="text-sm text-gray-500 mt-2">{product.description}</p>
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
                    </main>
                </div>
            </div>
            <Footer />
        </div>
    );
}
