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
                    <div className="-mx-3 md:flex mb-6">
                        <div className="md:w-full px-3">
                            <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">Nombre</label>
                            <input className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3" type="text" placeholder="Jane Doe" />
                        </div>
                    </div>
                    <div className="-mx-3 md:flex mb-6">
                        <div className="md:w-full px-3">
                            <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">Correo electrónico</label>
                            <input className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3" type="email" placeholder="carlos@gmail.com" />
                        </div>
                    </div>
                    <div className="-mx-3 md:flex mb-6">
                        <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">Número de Teléfono</label>
                            <input className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-red rounded py-3 px-4 mb-3" type="number" placeholder="1242141" />
                        </div>
                        <div className="md:w-1/2 px-3">
                            <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">Contraseña</label>
                            <input className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4" type="password" placeholder="****" />
                        </div>
                    </div>
                    <button type="submit" className="text-xl w-32 h-12 rounded bg-emerald-500 text-white relative overflow-hidden group z-10 hover:text-white duration-1000">
                        <span className="absolute bg-emerald-600 w-36 h-36 rounded-full group-hover:scale-100 scale-0 -z-10 -left-2 -top-10 group-hover:duration-500 duration-700 origin-center transform transition-all"></span>
                        <span className="absolute bg-emerald-800 w-36 h-36 -left-2 -top-10 rounded-full group-hover:scale-100 scale-0 -z-10 group-hover:duration-700 duration-500 origin-center transform transition-all"></span>
                        Guardar
                    </button>
                </div>

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
