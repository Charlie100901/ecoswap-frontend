'use client';
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

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
        <div className="flex flex-col min-h-screen dark:dark:bg-zinc-800">
            <Header />
            <main className="flex-grow mb-9 mx-32 p-4 mt-6">
                <h1 className="text-center text-3xl font-bold mb-6 dark:text-white">GESTIÓN DEL PERFIL</h1>

                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col my-2">
                    <h2 className="text-xl font-bold mb-4">Tus productos publicados</h2>
                    {loading ? (
                        <p className="text-center text-gray-500">Cargando productos...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : products.length === 0 ? (
                        <p className="text-center text-gray-500">No has publicado ningún producto.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <a href={"/product/" + product.id} key={product.id} >
                                    <div key={product.id} className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-full h-full">
                                        <img
                                            className="rounded-lg mb-4 w-full h-[200px]"
                                            src={product.imageProduct || '/img/default-product.jpeg'}
                                            alt={product.title}
                                            style={{ objectFit: 'cover' }}
                                        />
                                        <h3 className="text-xl font-bold">{product.title}</h3>
                                        <p className="text-gray-500 mt-2 whitespace-normal break-words">
                                            {product.description}
                                        </p>
                                    </div>
                                </a>
                            ))}
                        </div>

                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
