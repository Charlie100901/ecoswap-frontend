import Image from 'next/image';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';


export default function Footer() {
    return (
        <footer className="bg-[#333333] text-white shadow-[0_-4px_10px_rgba(0,0,0,0.1)] dark:shadow-black">
            <div className="container mx-auto p-9">
                <div className="flex flex-col md:flex-row justify-between">
                    <div className="flex flex-col md:w-1/3 mb-8 md:mb-0">
                        <div className="flex items-center">
                            <Image
                                src="/img/logo-blanco.png"
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

                    <div className="flex flex-col md:w-1/6 mb-8 md:mb-0">
                        <h5 className="text-lg font-bold mb-4">Páginas</h5>
                        <ul className="space-y-2">
                            <a href="/"><li>Inicio</li></a>
                            <a href="/product"><li>Ver Productos</li></a>
                            <li>Publicar Producto</li>
                        </ul>
                    </div>

                    <div className="flex flex-col md:w-1/4">
                        <h5 className="text-lg font-bold mb-4">Contacto</h5>
                        <ul className="space-y-2">
                            <li>
                                <span>📞</span> (406) 555-0120
                            </li>
                            <li>
                                <span>✉️</span> ecoswap@gmail.com
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
