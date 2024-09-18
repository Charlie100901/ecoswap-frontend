import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import Image from "next/image";


export default function Page() {
    return (
        <div >
            <Header />
            <div className="max-w-[1300px] mx-auto p-6">
                <h1 className="text-3xl font-bold text-center mb-6">VER PRODUCTO</h1>
                <div className="flex justify-center items-start space-x-8">
                    <div className="flex flex-col space-y-4">
                        <Image src="/img/pc-gamer.jpeg" alt="PC Gamer 1" width={80} height={80} className="rounded-md cursor-pointer hover:scale-105 transition-transform" />
                        <Image src="/img/pc-gamer.jpeg" alt="PC Gamer 2" width={80} height={80} className="rounded-md cursor-pointer hover:scale-105 transition-transform" />
                        <Image src="/img/pc-gamer.jpeg" alt="PC Gamer 3" width={80} height={80} className="rounded-md cursor-pointer hover:scale-105 transition-transform" />
                    </div>

                    <div className="flex space-x-8">
                        <Image
                            src="/img/pc-gamer.jpeg"
                            alt="Main PC Gamer"
                            width={400}
                            height={400}
                            className="rounded-md"
                        />

                        <div className="flex flex-col space-y-4">
                            <h2 className="text-2xl font-bold text-green-600">PC GAMER</h2>
                            <p className="text-[#4F3527]">
                                PC Gamer de alto rendimiento con procesador rápido, tarjeta gráfica potente,
                                almacenamiento SSD y RAM de 16GB. Ideal para gaming.
                            </p>
                            <ul className="space-y-2">
                                <li>
                                    <span className="font-bold">🟢 Estado:</span> Seminuevo
                                </li>
                                <li>
                                    <span className="font-bold">📂 Categoría:</span> Tecnología
                                </li>
                                <li>
                                    <span className="font-bold">📅 Fecha de publicación:</span> 20/05/2024
                                </li>
                                <li>
                                    <span className="font-bold">👤 Publicado por:</span> Jesús Mendoza
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
