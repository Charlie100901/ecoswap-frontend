"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null); 
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      localStorage.setItem("user", "carlos");
      const user = localStorage.getItem('user');
      if (user) {
        setUserName(user);
      }
    }
  }, []);

  const toggleSubmenu = () => {
    setIsSubmenuOpen(!isSubmenuOpen);
  };

  const isActiveLink = (path: string) => pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUserName(null);
    router.push('/');
  };

  const handlePublishClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!localStorage.getItem('token')) {
      e.preventDefault(); 
      router.push('/login'); 
    }
  };

  return (
    <header className="sticky top-0 z-50">
      <nav className="bg-white border-gray-200 shadow-md">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <Image
              src="/img/logo.png"
              alt="Logo ecoswap"
              width={40}
              height={40}
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-green-600">Eco<span className="text-black">Swap</span></span>
          </a>

          <button data-collapse-toggle="navbar-user" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200" aria-controls="navbar-user" aria-expanded="false">
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>

          <div className="flex-grow flex justify-center">
            <ul className="flex space-x-8">
              <li>
                <a href="/" className={`block py-2 px-3 rounded md:p-0 ${isActiveLink('/') ? 'text-green-600 font-bold' : 'text-black hover:text-green-600'}`} aria-current="page">Inicio</a>
              </li>
              <li className="relative">
                <button
                  onClick={toggleSubmenu}
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent hover:text-green-600 md:p-0"
                >
                  Categorías
                </button>
                {isSubmenuOpen && (
                  <ul className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <li><a href="#" className="block px-4 py-2 text-gray-900 hover:bg-gray-100">Categoría 1</a></li>
                    <li><a href="#" className="block px-4 py-2 text-gray-900 hover:bg-gray-100">Categoría 2</a></li>
                    <li><a href="#" className="block px-4 py-2 text-gray-900 hover:bg-gray-100">Categoría 3</a></li>
                  </ul>
                )}
              </li>
              <li>
                <a href="/UploadProduct" onClick={handlePublishClick} className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-700 md:p-0">
                  Publicar Producto
                </a>
              </li>
            </ul>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            {userName ? (
              <>
                <span className="text-gray-900">Hola, {userName}</span>
                <button onClick={handleLogout} className="text-red-600 hover:underline">Cerrar sesión</button>
              </>
            ) : (
              <>
                <a href="/login" className="text-gray-900 hover:text-green-700">Iniciar Sesión</a>
                <span className="text-black">/</span>
                <a href="/register" className="text-green-500 hover:text-green-700">Regístrate</a>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
