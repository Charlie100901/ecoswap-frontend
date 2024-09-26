import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Page() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow">
                <div>
                    <h1 className="text-center mt-14 mb-12 text-2xl font-bold">CARGAR PRODUCTO</h1>
                </div>
                <div className="flex justify-between mx-12">
                    <form className="w-full">
                        <div className="flex justify-between">
                            <div className="w-1/2 mr-4">
                                <label className="block font-medium">Titulo</label>
                                <input type="text" className="block w-3/4 pt-2 border border-gray-300 rounded-md " />
                            </div>
                            <div className="w-1/2 ml-4">
                                <label className="block font-medium">Estado del producto</label>
                                <select className="form-select block w-3/4 pt-2 border border-gray-300 rounded-md" >
                                    <option>Selecciona una opción</option>
                                    <option value="Nuevo">Nuevo</option>
                                    <option value="Casi Nuevo">Casi Nuevo</option>
                                    <option value="Usado">Usado</option>
                                </select>
                            </div>
                        </div>
                        <div className="w-1/2 mr-4 mt-5 ">
                            <label className="block font-medium">Categoria</label>
                            <select className="form-select block w-3/4 pt-2 border border-gray-300 rounded-md">
                                <option>Selecciona una opción</option>
                                <option value="tecnologia">Tecnología</option>
                                <option value="arte">Arte</option>
                                <option value="deporte">Deporte</option>
                                <option value="ropa">Ropa</option>
                                <option value="juguete">Juguetes</option>
                                <option value="hogar">Hogar</option>
                            </select>
                        </div>
                        <div className="w-1/2 mr-4 mt-5">
                            <label className="block font-medium">Descripción del Producto</label>
                            <textarea className="block w-3/4 pt-2 border border-gray-300 rounded-md h-32" />
                        </div>
                        <div className="w-1/2 mr-4 mt-5">
                            <label className="block font-medium">Imagen del Producto</label>
                            <input className="block w-3/4 pt-2 border border-gray-300 rounded-md mb-12" type="file" accept="image/png, image/jpeg" />
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}
