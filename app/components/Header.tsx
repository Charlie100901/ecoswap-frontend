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
  const [isDarkMode, setIsDarkMode] = useState(false);
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
          if (response.ok) {
            const data = await response.json();
            setUserName(data.name); 
            localStorage.setItem('userName', data.name); 
            setError(null); 
          } else if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            router.push('/login');
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            setError('Error al obtener el usuario. Inténtalo de nuevo más tarde.');
          }
        } catch (error) {
          setError('Error al hacer la solicitud. Inténtalo de nuevo más tarde.');
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

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleDarkModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setIsDarkMode(isChecked);
    if (isChecked) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

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
      return null;
    }
  }

  return (
    <header className="sticky top-0 z-50">
      <nav className="bg-white border-gray-200 shadow-md dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          {isDarkMode ? (
            <>
              <Image
              src="/img/logo-blanco.png"
              alt="Logo ecoswap"
              width={40}
              height={40}
            />
            </>

          ): (
            <>

            <Image
              src="/img/logo.png"
              alt="Logo ecoswap"
              width={40}
              height={40}
            />
            </>
          )
          }
            
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-green-600 dark:text-green-400">
              Eco<span className="text-black dark:text-white">Swap</span>
            </span>
          </a>

          <div className="flex-grow flex justify-center">
            <ul className="flex space-x-8">
              <li>
                <a href="/" className={`block py-2 px-3 rounded md:p-0 ${isActiveLink('/') ? 'text-green-600 font-bold dark:text-green-400' : 'text-black dark:text-white hover:text-green-600 dark:hover:text-green-400'}`} aria-current="page">Inicio</a>
              </li>
              <li>
                <a href="/product" className={`block py-2 px-3 rounded md:p-0 ${isActiveLink('/product') ? 'text-green-600 font-bold dark:text-green-400' : 'text-black dark:text-white hover:text-green-600 dark:hover:text-green-400'}`} aria-current="page">Ver Productos</a>
              </li>
              <li>
                <a href="/UploadProduct" onClick={handlePublishClick} className={`block py-2 px-3 rounded md:p-0 ${isActiveLink('/UploadProduct') ? 'text-green-600 font-bold dark:text-green-400' : 'text-black dark:text-white hover:text-green-600 dark:hover:text-green-400'}`}>
                  Publicar Producto
                </a>
              </li>
              {isAdmin && (
                <>
                  <li>
                    <a href="/admin/users" className={`block py-2 px-3 rounded md:p-0 ${isActiveLink('/admin/users') ? 'text-green-600 font-bold dark:text-green-400' : 'text-black dark:text-white hover:text-green-600 dark:hover:text-green-400'}`}>
                      Usuarios
                    </a>
                  </li>
                  <li>
                    <a href="/admin/products" className={`block py-2 px-3 rounded md:p-0 ${isActiveLink('/admin/products') ? 'text-green-600 font-bold dark:text-green-400' : 'text-black dark:text-white hover:text-green-600 dark:hover:text-green-400'}`}>
                      Productos
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>

          <label className="inline-flex items-center relative mr-2 ">
            <input className="peer hidden" id="toggle" type="checkbox" checked={isDarkMode} onChange={handleDarkModeChange}/>
            <div
              className="relative w-[110px]  h-[50px] bg-white peer-checked:bg-zinc-500 rounded-full after:absolute after:content-[''] after:w-[40px] after:h-[40px] after:bg-gradient-to-r from-orange-500 to-yellow-400 peer-checked:after:from-zinc-900 peer-checked:after:to-zinc-900 after:rounded-full after:top-[5px] after:left-[5px] active:after:w-[50px] peer-checked:after:left-[105px] peer-checked:after:translate-x-[-100%] shadow-sm duration-300 after:duration-300 after:shadow-md "
            ></div>
            <svg
              height="0"
              width="100"
              viewBox="0 0 24 24"
              data-name="Layer 1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-white peer-checked:opacity-60 absolute w-6 h-6 left-[13px] "
            >
              <path
                d="M12,17c-2.76,0-5-2.24-5-5s2.24-5,5-5,5,2.24,5,5-2.24,5-5,5ZM13,0h-2V5h2V0Zm0,19h-2v5h2v-5ZM5,11H0v2H5v-2Zm19,0h-5v2h5v-2Zm-2.81-6.78l-1.41-1.41-3.54,3.54,1.41,1.41,3.54-3.54ZM7.76,17.66l-1.41-1.41-3.54,3.54,1.41,1.41,3.54-3.54Zm0-11.31l-3.54-3.54-1.41,1.41,3.54,3.54,1.41-1.41Zm13.44,13.44l-3.54-3.54-1.41,1.41,3.54,3.54,1.41-1.41Z"
              ></path>
            </svg>
            <svg
              height="512"
              width="512"
              viewBox="0 0 24 24"
              data-name="Layer 1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-black opacity-60 peer-checked:opacity-70 peer-checked:fill-white absolute w-6 h-6 right-[13px]"
            >
              <path
                d="M12.009,24A12.067,12.067,0,0,1,.075,10.725,12.121,12.121,0,0,1,10.1.152a13,13,0,0,1,5.03.206,2.5,2.5,0,0,1,1.8,1.8,2.47,2.47,0,0,1-.7,2.425c-4.559,4.168-4.165,10.645.807,14.412h0a2.5,2.5,0,0,1-.7,4.319A13.875,13.875,0,0,1,12.009,24Zm.074-22a10.776,10.776,0,0,0-1.675.127,10.1,10.1,0,0,0-8.344,8.8A9.928,9.928,0,0,0,4.581,18.7a10.473,10.473,0,0,0,11.093,2.734.5.5,0,0,0,.138-.856h0C9.883,16.1,9.417,8.087,14.865,3.124a.459.459,0,0,0,.127-.465.491.491,0,0,0-.356-.362A10.68,10.68,0,0,0,12.083,2ZM20.5,12a1,1,0,0,1-.97-.757l-.358-1.43L17.74,9.428a1,1,0,0,1,.035-1.94l1.4-.325.351-1.406a1,1,0,0,1,1.94,0l.355,1.418,1.418.355a1,1,0,0,1,0,1.94l-1.418.355-.355,1.418A1,1,0,0,1,20.5,12ZM16,14a1,1,0,0,0,2,0A1,1,0,0,0,16,14Zm6,4a1,1,0,0,0,2,0A1,1,0,0,0,22,18Z"
              ></path>
            </svg>
          </label>

          <div className="space-x-3 flex items-center">
          {userName ? (
              <>
              <div className="relative group">
                <div className="flex items-center dark:hover:bg-black hover:bg-gray-100 hover:rounded hover:cursor-pointer p-2">
                  <span className="text-gray-900 mt-2 mr-2 dark:text-white">{userName}</span>
                  {/* <img src="/img/henry.jpg" alt="User Avatar" className="w-[30px] h-10 rounded-full" /> */}
                  {isDarkMode ? (
                    <>
                      <img src="/img/arrow-down-white.svg" alt="Arrow Down" className="w-[20px] dark:text-white" />

                    </>
                  ) : (
                    <>
                      <img src="/img/arrow-down.svg" alt="Arrow Down" className="w-[20px] dark:text-white" />

                    </>
                  )
                  }
                </div>

                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                <ul className="py-2">
                  <li className="px-4 py-2 hover:bg-gray-100">
                    <a href="/profile" className="flex items-center gap-2 text-gray-700">
                      <img src="/img/profile.svg" alt="Perfil" className="w-4" />
                      Perfil
                    </a>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100">
                    <a href="#" className="flex items-center gap-2 text-gray-700" onClick={handleLogout}>
                      <img src="/img/logout.svg" alt="Cerrar sesión" className="w-4" />
                      Cerrar sesión
                    </a>
                  </li>
                </ul>

                </div>
              </div>

                {/* <button onClick={handleLogout}
                  className="group flex items-center justify-start w-11 h-11 bg-red-600 rounded-full cursor-pointer relative overflow-hidden transition-all duration-200 shadow-lg hover:w-32 hover:rounded-lg active:translate-x-1 active:translate-y-1"
                >
                  <div
                    className="flex items-center justify-center w-full transition-all duration-300 group-hover:justify-start group-hover:px-3"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 512 512" fill="white">
                      <path
                        d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
                      ></path>
                    </svg>
                  </div>
                  <div
                    className="absolute right-5 transform translate-x-full opacity-0 text-white text-lg font-semibold transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                  >
                    Logout
                  </div>
                </button> */}

              </>
            ) : (
              <>
                <a href="/login" className="text-gray-900 hover:text-green-700 dark:text-white">Iniciar Sesión</a>
                <span className="text-black dark:text-white">/</span>
                <a href="/register" className="text-green-500 hover:text-green-700">Regístrate</a>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
