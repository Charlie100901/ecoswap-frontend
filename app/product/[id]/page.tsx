"use client";
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

interface Product {
    id: string; 
    title: string;
    description: string;
    imageProduct?: string; 
    conditionProduct?: string; 
    category?: string; 
    releaseDate?: string; 
    publishedBy?: string; 
}

export default function Page({ params }: { params: { id: string } }) {
    const { id } = params;
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [fadeIn, setFadeIn] = useState<boolean>(false); 

    useEffect(() => {
        const fetchProductDetail = async () => {
            if (!id) return;
            try {
                const response = await fetch(`http://localhost:8080/api/v1/product/${id}`);
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

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mb-4"></div>
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

    return (
        <div className={`transition-opacity duration-700 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
            <Header />
            <div className="max-w-[1300px] mx-auto p-6">
                <h1 className="text-3xl font-bold text-center mb-6">VER PRODUCTO</h1>
                <div className="flex justify-center items-start space-x-8">
                    <div className="flex flex-col space-y-4">
                        {[1, 2, 3].map((index) => (
                            <Image
                                key={index}
                                src={product.imageProduct || '/img/default-product.jpeg'}
                                alt={`PC Gamer ${index}`}
                                width={80}
                                height={80}
                                className="rounded-md cursor-pointer hover:scale-105 transition-transform"
                            />
                        ))}
                    </div>

                    <div className="flex space-x-8">
                        <Image
                            src={product.imageProduct || '/img/default-product.jpeg'}
                            alt="Main Product Image"
                            width={400}
                            height={400}
                            className="rounded-md"
                        />

                        <div className="flex flex-col space-y-4">
                            <h2 className="text-2xl font-bold text-green-600 uppercase">{product.title}</h2>
                            <p className="text-[#4F3527]">{product.description}</p>
                            <ul className="space-y-2">
                                <li>
                                    <span className="font-bold">🟢 Estado:</span> {product.conditionProduct}
                                </li>
                                <li>
                                    <span className="font-bold">📂 Categoría:</span> {product.category}
                                </li>
                                <li>
                                    <span className="font-bold">📅 Fecha de publicación:</span> {product.releaseDate}
                                </li>
                                <li>
                                    <span className="font-bold">👤 Publicado por:</span> {product.publishedBy}
                                </li>
                            </ul>
                            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                                Pedir Intercambio
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-4">Productos Disponibles para Intercambio</h2>
                    <div className="flex justify-between p-4 border rounded-md relative bg-gray-200">
                        <Image
                            src="/img/pc-gamer.jpeg"
                            alt="PC Gamer"
                            width={120}
                            height={120}
                            className="rounded-md"
                        />
                        <div className="flex flex-col justify-between flex-grow ml-4">
                            <h3 className="text-xl font-bold">PC GAMER</h3>
                            <ul className="text-sm space-y-1">
                                <li>
                                    <span className="font-bold">Estado:</span> Seminuevo
                                </li>
                                <li>
                                    <span className="font-bold">Categoría:</span> Tecnología
                                </li>
                                <li>
                                    <span className="font-bold">Publicado por:</span> Jesús Mendoza
                                </li>
                            </ul>
                            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors absolute bottom-4 right-4">
                                Intercambiar
                            </button>
                        </div>
                        <span className="absolute top-4 right-4 text-gray-500 text-xs">Publicado el 22/05/2024</span>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}