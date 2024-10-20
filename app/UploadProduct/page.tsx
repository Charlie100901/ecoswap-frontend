'use client';
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation'; 
import Header from "../components/Header";
import Footer from "../components/Footer";

interface FormData {
    title: string;
    category: string;
    conditionProduct: string;
    file: File | null; 
    description: string;
}

export default function Page() {
    const [formData, setFormData] = useState<FormData>({
        title: '',
        category: '',
        conditionProduct: '',
        file: null,
        description: ''
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const searchParams = useSearchParams();
    const productTo = searchParams.get('productTo'); 

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, files } = e.target as HTMLInputElement; 
        setFormData(prevState => ({
            ...prevState,
            [name]: files ? files[0] : value 
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        for (const key in formData) {
            formDataToSend.append(key, formData[key as keyof FormData] as any); 
        }

        try {
            const token = localStorage.getItem('token');

            const requestOptions: RequestInit = {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend
            };

            const response = await fetch('http://localhost:8080/api/v1/product/create', requestOptions);

            if (response.ok) {
                const newProduct = await response.json();

                if (productTo) {
                    await fetch('http://localhost:8080/api/v1/create-exchange', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            productFrom: { id: newProduct.id },
                            productTo: { id: productTo }
                        })
                    });
                }

                setIsModalOpen(true);
                setFormData({
                    title: '',
                    category: '',
                    conditionProduct: '',
                    file: null,
                    description: ''
                });
            } else {
                console.error('Error al subir el producto:', response.statusText);
            }
        } catch (error) {
            console.error('Error al enviar la solicitud:', error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false); 
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow mb-9 mx-32 p-4">
            <div>
                    <h1 className="text-center mt-14 mb-12 text-2xl font-bold">CARGAR PRODUCTO</h1>
                </div>
                <div className="flex justify-between mx-12">
                    <form className="w-full" onSubmit={handleSubmit}>
                        <div className="flex justify-between">
                            <div className="w-1/2 mr-4">
                                <label className="block font-medium">Titulo</label>
                                <input
                                    type="text"
                                    className="block w-3/4 pt-2 border border-gray-300 rounded-md"
                                    name="title"
                                    value={formData.title} 
                                    onChange={handleChange} 
                                />
                            </div>
                            <div className="w-1/2 ml-4">
                                <label className="block font-medium">Estado del producto</label>
                                <select
                                    className="block w-3/4 pt-2 border border-gray-300 rounded-md"
                                    name="conditionProduct"
                                    value={formData.conditionProduct} 
                                    onChange={handleChange} 
                                >
                                    <option value="">Selecciona una opción</option>
                                    <option value="nuevo">Nuevo</option>
                                    <option value="casi nuevo">Casi Nuevo</option>
                                    <option value="usado">Usado</option>
                                </select>
                            </div>
                        </div>
                        <div className="w-1/2 mr-4 mt-5">
                            <label className="block font-medium">Categoria</label>
                            <select
                                className="block w-3/4 pt-2 border border-gray-300 rounded-md"
                                name="category"
                                value={formData.category} 
                                onChange={handleChange}
                            >
                                <option value="">Selecciona una opción</option>
                                <option value="Electrónica y Tecnología">Electrónica y Tecnología</option>
                                <option value="Hogar y Muebles">Hogar y Muebles</option>
                                <option value="Juguetes y Accesorios">Juguetes y Accesorios</option>
                                <option value="Libros y Entretenimiento">Libros y Entretenimiento</option>
                                <option value="Deportes y Aire Libre">Deportes y Aire Libre</option>
                                <option value="Ropa y Accesorios">Ropa y Accesorios</option>
                                <option value="Mascotas">Mascotas</option>
                                <option value="Oficina y Papelería">Oficina y Papelería</option>
                                <option value="Salud y Belleza">Salud y Belleza</option>
                                <option value="Joyería y Relojes">Joyería y Relojes</option>
                            </select>
                        </div>
                        <div className="w-1/2 mr-4 mt-5">
                            <label className="block font-medium">Descripción del Producto</label>
                            <textarea
                                className="block w-3/4 pt-2 border border-gray-300 rounded-md h-32"
                                name="description"
                                value={formData.description} 
                                onChange={handleChange} 
                            />
                        </div>
                        <div className="w-1/2 mr-4 mt-5">
                            <label className="block font-medium">Imagen del Producto</label>
                            <input
                                className="block w-3/4 pt-2 border border-gray-300 rounded-md mb-12"
                                type="file"
                                name="file"
                                accept="image/png, image/jpeg"
                                onChange={handleChange} 
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-4 rounded"
                        >
                            Subir producto
                        </button>
                    </form>
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-lg font-bold mb-4">Producto creado exitosamente</h2>
                            <button
                                className="bg-blue-500 text-white py-2 px-4 rounded"
                                onClick={closeModal}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
