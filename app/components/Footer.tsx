

import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="bg-[#333333] text-white">
            <div className="container mx-auto p-9">
                <div className="flex flex-col md:flex-row justify-between">
                    {/* Logo y descripción */}
                    <div className="flex flex-col md:w-1/3 mb-8 md:mb-0">
                        <div className="flex items-center">
                            <Image
                                src="/img/logo.png"
                                alt="Logo EcoSwap"
                                width={50}
                                height={40}
                                className="mr-2"
                            />
                            <h5 className="text-lg font-bold">EcoSwap</h5>
                        </div>
                        <p className="mt-4">
                            En EcoSwap, creemos en un mundo donde la sostenibilidad y la comunidad van de la mano. Nuestra plataforma proporciona un espacio en línea para que las personas intercambien artículos de manera fácil, segura y respetuosa con el medio ambiente.
                        </p>
                    </div>

                    {/* Páginas */}
                    <div className="flex flex-col md:w-1/6 mb-8 md:mb-0">
                        <h5 className="text-lg font-bold mb-4">Páginas</h5>
                        <ul className="space-y-2">
                            <li>Inicio</li>
                            <li>Publicar Producto</li>
                            <li>Inicia Sesión</li>
                            <li>Regístrate</li>
                        </ul>
                    </div>

                    {/* Contacto */}
                    <div className="flex flex-col md:w-1/4">
                        <h5 className="text-lg font-bold mb-4">Contacto</h5>
                        <ul className="space-y-2">
                            <li>
                                <span>📞</span> (406) 555-0120
                            </li>
                            <li>
                                <span>✉️</span> mangcoding123@gmail.com
                            </li>
                            <li>
                                <span>📍</span> 2972 Westheimer Rd. Santa Ana, Illinois 85486
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}
