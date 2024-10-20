"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

interface DecodedToken {
  role: string;
}

export default function Header() {
  const [userName, setUserName] = useState<string | null>(localStorage.getItem('userName')); 
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      const fetchUserName = async () => {
        try {
          const response = await fetch('http://localhost:8080/api/v1/user/me', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          console.log(response.status)
          if (response.ok) {
            const data = await response.json();
            console.log(data);
            setUserName(data.name); 
            localStorage.setItem('userName', data.name); 
            setError(null); 
          } else if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            router.push('/login');
          } else {
            setError('Error al obtener el usuario. Inténtalo de nuevo más tarde.');
            console.error('Error al obtener el usuario:', response.status);
          }
        } catch (error) {
          setError('Error al hacer la solicitud. Inténtalo de nuevo más tarde.');
          console.error('Error al hacer la solicitud:', error);
        }
      };
      fetchUserName();
    }
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken = decodeJwt(token);
      if (decodedToken) {
        setIsAdmin(decodedToken.role === 'ADMIN');
      }
    }
  }, []);

  const isActiveLink = (path: string) => pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setUserName(null);
    router.refresh();
    router.push('/');
  };

  const handlePublishClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!localStorage.getItem('token')) {
      e.preventDefault(); 
      router.push('/login'); 
    }
  };

  function decodeJwt(token: string): DecodedToken | null {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      return decodedPayload as DecodedToken;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }

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
                <a href="/product" className={`block py-2 px-3 rounded md:p-0 ${isActiveLink('/product') ? 'text-green-600 font-bold' : 'text-black hover:text-green-600'}`} aria-current="page">Ver Productos</a>
              </li>
              <li>
                <a href="/UploadProduct" onClick={handlePublishClick} className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-700 md:p-0">
                  Publicar Producto
                </a>
              </li>
              {isAdmin && (
                <>
                  <li>
                    <a href="/admin/users" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-700 md:p-0">
                      Usuarios
                    </a>
                  </li>
                  <li>
                    <a href="/admin/products" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-700 md:p-0">
                      Productos
                    </a>
                  </li>
                </>
              )}
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
