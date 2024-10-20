"use client";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow mb-9 mx-32 p-4">
        <div>
          <h1 className="text-center mt-14 mb-12 text-2xl font-bold">
            ¡Bienvenido, Administrador!
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto mt-6">
          <a
            href="#"
            className="block p-6 border border-gray-400 bg-white rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <h5 className="mb-2 text-7xl font-bold tracking-tight text-green-600 dark:text-white text-center">
              900
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400 text-center">
              Total de Usuarios
            </p>
          </a>
          <a
            href="#"
            className="block p-6 bg-white border border-gray-400 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <h5 className="mb-2 text-7xl font-bold tracking-tight text-green-600 dark:text-white text-center">
              270
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400 text-center">
              Total de Productos
            </p>
          </a>
          <a
            href="#"
            className="block p-6 bg-white border border-gray-400 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <h5 className="mb-2 text-7xl font-bold tracking-tight text-green-600 dark:text-white text-center">
              230
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400 text-center">
              Total de Intercambios
            </p>
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
