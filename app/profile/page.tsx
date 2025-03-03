'use client';
import { useState, useEffect } from "react";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";

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

    useEffect(() => {
        const fetchUserProducts = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:8080/api/v1/product/user`,{
                    method: 'GET',
                    headers: {
                    'Authorization': `Bearer ${token}`
                    }
                }
                );


                if (!response.ok) {
                    throw new Error('Error al cargar los productos del usuario');
                }
                const data: Product[] = await response.json();
                setProducts(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProducts();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-zinc-800">
            <Header />
            <main className="flex-grow mb-9 mx-4 sm:mx-8 lg:mx-32 p-4 mt-6">
                <h1 className="text-center text-3xl font-bold mb-6 text-gray-800 dark:text-white">Gestión del Perfil</h1>

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
                                    <div key={product.id} className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-600 rounded-lg shadow-lg p-4 w-full h-full">
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
            </main>
            <Footer />
        </div>
    );
}
