import Image from "next/image";

export default function Product() {
    return (
        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 transition-transform duration-300 hover:scale-105 hover:shadow-lg">
            <a href="#">
                {/* Imagen con animación de zoom al hacer hover */}
                <img 
                    className="rounded-t-lg transition-transform duration-300 ease-in-out hover:scale-110" 
                    src="/img/pc-gamer.jpeg" 
                    alt="PC Gamer" 
                />
            </a>
            <div className="p-5 bg-[#D8D8D8]">
                <a href="#">
                    {/* Título con animación de cambio de color y deslizamiento */}
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white transition-all duration-300 ease-in-out hover:text-blue-700">
                        PC GAMER
                    </h5>
                </a>
                <p className="mb-3 font-normal text-[#4F3527] dark:text-gray-400">
                    PC Gamer de alto rendimiento con procesador rápido, tarjeta gráfica potente, almacenamiento SSD y RAM de 16GB. Ideal para gaming.
                </p>
                {/* Botón con animación de cambio de color y ligero movimiento */}
                <a 
                    href="#" 
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg transition-all duration-300 ease-in-out hover:bg-blue-800 hover:translate-x-1 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
        </div>
    );
}
