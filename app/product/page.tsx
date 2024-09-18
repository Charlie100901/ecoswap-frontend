"use client"
import Image from 'next/image';
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Page() {
    const [activePage, setActivePage] = useState(1);
    const totalPages = 10;

    const products = [
        {
            name: 'PC Gamer',
            description:
                'PC Gamer de alto rendimiento con procesador rápido, tarjeta gráfica potente, almacenamiento SSD y RAM de 16GB. Ideal para gaming.',
            imageUrl: '/img/pc-gamer.jpeg',
        },
        {
            name: 'PC Gamer',
            description:
                'PC Gamer de alto rendimiento con procesador rápido, tarjeta gráfica potente, almacenamiento SSD y RAM de 16GB. Ideal para gaming.',
            imageUrl: '/img/pc-gamer.jpeg',
        },
        {
            name: 'PC Gamer',
            description:
                'PC Gamer de alto rendimiento con procesador rápido, tarjeta gráfica potente, almacenamiento SSD y RAM de 16GB. Ideal para gaming.',
            imageUrl: '/img/pc-gamer.jpeg',
        },
        {
            name: 'PC Gamer',
            description:
                'PC Gamer de alto rendimiento con procesador rápido, tarjeta gráfica potente, almacenamiento SSD y RAM de 16GB. Ideal para gaming.',
            imageUrl: '/img/pc-gamer.jpeg',
        },
        {
            name: 'PC Gamer',
            description:
                'PC Gamer de alto rendimiento con procesador rápido, tarjeta gráfica potente, almacenamiento SSD y RAM de 16GB. Ideal para gaming.',
            imageUrl: '/img/pc-gamer.jpeg',
        },
    ];

    return (
        <div>
            <Header />
            <div className="container mx-auto p-4">
                <h1 className="text-center text-3xl font-bold mb-6">ENCUENTRA LO QUE NECESITAS</h1>

                <div className="flex">
                    <aside className="w-1/4 p-4 bg-[#F4F4F4] rounded-lg shadow-lg">
                        <h3 className="font-bold text-lg mb-4">Categorías</h3>
                        <ul className="space-y-2">
                            <li>Electrónica</li>
                            <li>Hogar y Muebles</li>
                            <li>Juguetes y Accesorios</li>
                            <li>Libros y Entretenimiento</li>
                            <li>Deportes y Aire Libre</li>
                            <li>Ropa y Accesorios</li>
                            <li>Mascotas</li>
                            <li>Oficina y Papelería</li>
                            <li>Salud y Belleza</li>
                            <li>Joyería y Relojes</li>
                        </ul>
                    </aside>

                    <main className="flex-1 ml-8">
                        <div className="grid grid-cols-3 gap-6 ">
                            {products.map((product, index) => (
                                <div
                                    key={index}
                                    className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                                >
                                    <a href="#">
                                        <Image
                                            className="rounded-lg"
                                            src={product.imageUrl}
                                            alt={product.name}
                                            width={340}
                                            height={200}
                                        />
                                    </a>
                                    <h3 className="text-xl font-bold mt-4">{product.name}</h3>
                                    <p className="text-sm text-gray-500 mt-2">{product.description}</p>
                                    <a
                                        href="/product/1"
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

                        <div className="mt-6 flex justify-center items-center space-x-2">
                            <button
                                onClick={() => setActivePage(activePage - 1)}
                                disabled={activePage === 1}
                                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                &lt;
                            </button>
                            {Array.from({ length: totalPages }).map((_, pageIndex) => (
                                <button
                                    key={pageIndex}
                                    onClick={() => setActivePage(pageIndex + 1)}
                                    className={`px-3 py-1 ${activePage === pageIndex + 1
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200'
                                        } rounded hover:bg-gray-300`}
                                >
                                    {pageIndex + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setActivePage(activePage + 1)}
                                disabled={activePage === totalPages}
                                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                &gt;
                            </button>
                        </div>
                    </main>
                </div>
            </div>
            <Footer />
        </div>
    );
}
