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
    const [isShowing, setIsShowing] = useState(false);
    const searchParams = useSearchParams();
    const productTo = searchParams.get('productTo'); 

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, files } = e.target as HTMLInputElement; 
        setFormData(prevState => ({
            ...prevState,
            [name]: files ? files[0] : value 
        }));
    };

    useEffect(() => {
        if (isModalOpen) {
            setTimeout(() => {
                setIsShowing(true);
            }, 50);
        } else {
            setIsShowing(false);
        }
    }, [isModalOpen]);

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
        <div className="flex flex-col min-h-screen dark:dark:bg-zinc-800">
            <Header />
            <main className="flex-grow  mx-32 p-4 mb-[100px]">
                <div>
                    <h1 className="text-center mt-14 mb-6 text-2xl font-bold dark:text-white">CARGAR PRODUCTO</h1>
                </div>
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-14 mx-auto w-full">
                    <div className="flex justify-between mx-3">
                        <form className="w-full" onSubmit={handleSubmit}>
                            <div className="flex justify-between">
                                <div className="w-1/2 mr-4">
                                    <label className="block font-medium dark:text-white">Titulo <span className="text-red-600">*</span></label>
                                    <input
                                        type="text"
                                        className="block w-3/4 pt-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white"
                                        name="title"
                                        value={formData.title} 
                                        onChange={handleChange} 
                                        required
                                    />
                                </div>
                                <div className="w-1/2 ml-4">
                                    <label className="block font-medium dark:text-white">Estado del producto <span className="text-red-600">*</span></label>
                                    <select
                                        className="block w-3/4 pt-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white"
                                        name="conditionProduct"
                                        value={formData.conditionProduct} 
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Selecciona una opción</option>
                                        <option value="nuevo">Nuevo</option>
                                        <option value="casi nuevo">Casi Nuevo</option>
                                        <option value="usado">Usado</option>
                                    </select>
                                </div>
                            </div>

                            <div className="w-1/2 mr-4 mt-5">
                                <label className="block font-medium dark:text-white">Categoría <span className="text-red-600">*</span></label>
                                <select
                                    className="block w-3/4 pt-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white"
                                    name="category"
                                    value={formData.category} 
                                    onChange={handleChange}
                                    required
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
                                <label className="block font-medium dark:text-white">Descripción del Producto <span className="text-red-600">*</span></label>
                                <textarea
                                    className="block w-3/4 pt-2 border border-gray-300 dark:border-gray-600 rounded-md h-32 bg-gray-100 dark:bg-gray-700 dark:text-white"
                                    name="description"
                                    value={formData.description} 
                                    onChange={handleChange} 
                                    required
                                />
                            </div>

                            <div className="w-1/2 mr-4 mt-5">
                                <label className="block font-medium dark:text-white">Imagen del Producto <span className="text-red-600">*</span></label>
                                <input
                                    className="block w-3/4  border dark:text-white border-gray-300 dark:border-gray-600 rounded-md mb-12 bg-gray-100 dark:bg-gray-700"
                                    type="file"
                                    name="file"
                                    accept="image/png, image/jpeg"
                                    onChange={handleChange} 
                                />
                            </div>

                            <button
                                type="submit"
                                className="text-xl w-48 h-12 rounded bg-emerald-500 text-white relative overflow-hidden group z-10 hover:text-white duration-1000"
                            >
                                <span className="absolute bg-emerald-600 w-52 h-36 rounded-full group-hover:scale-100 scale-0 -z-10 -left-2 -top-10 group-hover:duration-500 duration-700 origin-center transform transition-all"></span>
                                <span className="absolute bg-emerald-800 w-52 h-36 -left-2 -top-10 rounded-full group-hover:scale-100 scale-0 -z-10 group-hover:duration-700 duration-500 origin-center transform transition-all"></span>
                                Subir Producto
                            </button>
                        </form>
                    </div>
                </div>


                {isModalOpen && (
                    <div className={`fixed inset-0 p-4 flex justify-center items-center w-full h-full z-[1000] bg-[rgba(0,0,0,0.5)] overflow-auto font-sans transition-opacity duration-300 ${
                        isShowing ? 'opacity-100' : 'opacity-0'
                    }`}>
                        <div className={`w-full max-w-lg bg-white shadow-lg rounded-lg p-6 relative transition-all duration-300 ${
                            isShowing ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                        }`}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-3.5 cursor-pointer float-right fill-gray-400 hover:fill-red-500 transition-colors duration-200"
                                viewBox="0 0 320.591 320.591"
                                onClick={closeModal}
                            >
                                <path d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z" />
                                <path d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z" />
                            </svg>
                    
                            <div className="my-8 text-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`w-14 h-14 fill-green-500 mx-auto transition-transform duration-500 ${
                                        isShowing ? 'scale-100' : 'scale-0'
                                    } animate-bounce`}
                                    viewBox="0 0 512 512"
                                >
                                    <path d="M383.841 171.838c-7.881-8.31-21.02-8.676-29.343-.775L221.987 296.732l-63.204-64.893c-8.005-8.213-21.13-8.393-29.35-.387-8.213 7.998-8.386 21.137-.388 29.35l77.492 79.561a20.687 20.687 0 0 0 14.869 6.275 20.744 20.744 0 0 0 14.288-5.694l147.373-139.762c8.316-7.888 8.668-21.027.774-29.344z" />
                                    <path d="M256 0C114.84 0 0 114.84 0 256s114.84 256 256 256 256-114.84 256-256S397.16 0 256 0zm0 470.487c-118.265 0-214.487-96.214-214.487-214.487 0-118.265 96.221-214.487 214.487-214.487 118.272 0 214.487 96.221 214.487 214.487 0 118.272-96.215 214.487-214.487 214.487z" />
                                </svg>
                                <h4 className={`text-xl text-gray-800 font-semibold mt-4 transition-all duration-300 ${
                                    isShowing ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                                }`}>
                                    ¡Producto creado exitosamente!
                                </h4>
                                <p className={`text-sm text-gray-500 leading-relaxed mt-2 transition-all duration-300 delay-100 ${
                                    isShowing ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                                }`}>
                                    El producto ha sido agregado correctamente. Puedes seguir gestionando tus productos o crear uno nuevo.
                                </p>
                            </div>
                    
                            <button
                                type="button"
                                onClick={closeModal}
                                className={`mt-4 px-5 py-2.5 w-full rounded-lg text-white text-sm border-none outline-none bg-green-600 hover:bg-green-500 transition-all duration-300 delay-200 ${
                                    isShowing ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                                }`}
                            >
                                ¡Entendido!
                            </button>
                        </div>
                    </div>
                
                )}
            </main>
            <Footer />
        </div>
    );
}
