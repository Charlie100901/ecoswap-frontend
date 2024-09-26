"use client";

import { useState } from 'react';
import Image from 'next/image';


export default function Header() {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  const toggleSubmenu = () => {
    setIsSubmenuOpen(!isSubmenuOpen);
  };

  return (
    <header className="sticky top-0 z-50">
      <nav className="bg-white border-gray-200 shadow-md ">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <Image
              src="/img/logo.png"
              alt="Logo ecoswap"
              width={40}
              height={40}
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-black">EcoSwap</span>
          </a>
          <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <form className="max-w-md mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                  </svg>
                </div>
                <input type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-lime-600 hover:bg-lime-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Buscar</button>
              </div>
            </form>
          </div>
          <button data-collapse-toggle="navbar-user" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200" aria-controls="navbar-user" aria-expanded="false">
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
          <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
              <li>
                <a href="/" className="block py-2 px-3 text-black bg-blue-700 rounded md:bg-transparent md:p-0 hover:text-green-600" aria-current="page">Inicio</a>
              </li>
              {/* Dropdown Categorias */}
              <li className="relative">
                <button
                  onClick={toggleSubmenu}
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent hover:text-green-600 md:p-0"
                >
                  Categorias
                </button>

                {isSubmenuOpen && (
                  <ul className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <li>
                      <a href="#" className="block px-4 py-2 text-gray-900 hover:bg-gray-100">
                        Categoría 1
                      </a>
                    </li>
                    <li>
                      <a href="#" className="block px-4 py-2 text-gray-900 hover:bg-gray-100">
                        Categoría 2
                      </a>
                    </li>
                    <li>
                      <a href="#" className="block px-4 py-2 text-gray-900 hover:bg-gray-100">
                        Categoría 3
                      </a>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <a href="/UploadProduct" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-700 md:p-0">Publicar Producto</a>
              </li>
              <li>
                <a href="/login" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-700 md:p-0">Iniciar Sesión</a>
              </li>
              <li>
                <a href="/register" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-700 md:p-0">Registrate</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
