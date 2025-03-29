"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Bell, MessageCircle, X } from "lucide-react";
import { Client } from "@stomp/stompjs";
import config from "@/config";
import { useChat } from "../hooks/useChat";

interface DecodedToken {
  role: string;
}

interface ChatMessage {
  id?: number;
  senderId: number; // ID del usuario que envía el mensaje
  receiverId: number; // ID del usuario que recibe el mensaje
  content: string;
  exchangeId?: number; // ID del intercambio
  timestamp: string; // Fecha y hora del mensaje
}

export default function Header() {
  const [userName, setUserName] = useState<string | null>(
    localStorage.getItem("userName")
  );
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [isModalNotificationOpen, setIsModalNotificationOpen] = useState(false);
  const [isModalChatOpen, setIsModalChatOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<ChatMessage | null>(null);
  const [activeChatMessages, setActiveChatMessages] = useState<ChatMessage[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  // const { sendMessage } = useChat(senderId, receiverId, exchangeId);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const fetchUserName = async () => {
        try {
          const response = await fetch(`${config.apiBaseUrl}/api/v1/user/me`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUserName(data.name);
            localStorage.setItem("userName", data.name);
            localStorage.setItem("userId", data.id);
            console.log(data);
            setError(null);
          } else if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("userName");
            router.push("/login");
          } else {
            localStorage.removeItem("token");
            localStorage.removeItem("userName");
            setError(
              "Error al obtener el usuario. Inténtalo de nuevo más tarde."
            );
          }
        } catch (error) {
          setError(
            "Error al hacer la solicitud. Inténtalo de nuevo más tarde."
          );
        }
      };
      fetchUserName();
    }
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = decodeJwt(token);
      if (decodedToken) {
        setIsAdmin(decodedToken.role === "ADMIN");
      }
    }
  }, []);

  useEffect(() => {
    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      debug: (str) => console.log(str),
      onConnect: () => {
        console.log("Conectado al WebSocket");
        const userId = localStorage.getItem("userId");

        client.subscribe(`/topic/notifications/${userId}`, (message) => {
          const newNotification = JSON.parse(message.body);
          console.log(newNotification);
          setNotifications((prev) => [newNotification, ...prev]);
        });
      },
      onStompError: (frame) => {
        console.error("Error en STOMP:", frame.headers["message"]);
      },
      onDisconnect: () => {
        console.log("Desconectado del WebSocket");
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, []);

  const fetchActiveChatMessages = async (chat: ChatMessage) => {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/api/v1/chat/message/exchange/${chat.senderId}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener los mensajes del chat activo");
      }
      const data: ChatMessage[] = await response.json();
      setActiveChatMessages(data);
    } catch (error) {
      console.error("Error al obtener los mensajes del chat activo:", error);
    }
  };
  
  const handleChatClick = (chat: ChatMessage) => {
    setActiveChat(chat);
    fetchActiveChatMessages(chat);
  };

  useEffect(() => {
    if (
      localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    const fetchChats = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
  
      try {
        const response = await fetch(`${config.apiBaseUrl}/api/v1/chat/message/exchange/${userId}`);
        if (!response.ok) {
          throw new Error("Error al obtener los chats");
        }
        const data = await response.json();
        setChats(data);
      } catch (error) {
        console.error("Error al obtener los chats:", error);
      }
    };
  
    if (isModalChatOpen) {
      fetchChats();
    }
  }, [isModalChatOpen]);

  const handleDarkModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setIsDarkMode(isChecked);
    if (isChecked) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const isActiveLink = (path: string) => pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setUserName(null);
    setIsAdmin(false);
    router.push("/");
  };

  const handlePublishClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    if (!localStorage.getItem("token")) {
      e.preventDefault();
      router.push("/login");
    }
  };

  function decodeJwt(token: string): DecodedToken | null {
    try {
      const payload = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(payload));
      return decodedPayload as DecodedToken;
    } catch (error) {
      return null;
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    console.log("🔄 Estado actualizado de notificaciones:", notifications);
  }, [notifications]);

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-900 sticky top-0 z-50">
      <nav className="bg-white border-gray-200 shadow-md dark:bg-gray-900 w-full ">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 ">
          <Link
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            {isDarkMode ? (
              <>
                <Image
                  src="/img/logo-blanco.png"
                  alt="Logo ecoswap"
                  width={40}
                  height={40}
                />
              </>
            ) : (
              <>
                <Image
                  src="/img/logo.png"
                  alt="Logo ecoswap"
                  width={40}
                  height={40}
                />
              </>
            )}

            <span className="self-center text-2xl font-semibold whitespace-nowrap text-green-600 dark:text-green-400">
              Eco<span className="text-black dark:text-white">Swap</span>
            </span>
          </Link>
          <div className="flex items-center lg:order-2">
            <button
              data-collapse-toggle="mobile-menu-2"
              type="button"
              className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="mobile-menu-2"
              aria-expanded={isMenuOpen ? "true" : "false"}
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`w-6 h-6 ${isMenuOpen ? "hidden" : "block"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <svg
                className={`w-6 h-6 ${isMenuOpen ? "block" : "hidden"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
          </div>

          <div
            className={`${
              isMenuOpen ? "block" : "hidden"
            } w-full lg:flex lg:w-auto `}
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <Link
                  href="/"
                  className={`block py-2 px-3 rounded md:p-0 ${
                    isActiveLink("/")
                      ? "text-green-600 font-bold dark:text-green-400"
                      : "text-black dark:text-white hover:text-green-600 dark:hover:text-green-400"
                  }`}
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/product"
                  className={`block py-2 px-3 rounded md:p-0 ${
                    isActiveLink("/product")
                      ? "text-green-600 font-bold dark:text-green-400"
                      : "text-black dark:text-white hover:text-green-600 dark:hover:text-green-400"
                  }`}
                  aria-current="page"
                >
                  Ver Productos
                </Link>
              </li>
              <li>
                <Link
                  href="/UploadProduct"
                  onClick={handlePublishClick}
                  className={`block py-2 px-3 rounded md:p-0 ${
                    isActiveLink("/UploadProduct")
                      ? "text-green-600 font-bold dark:text-green-400"
                      : "text-black dark:text-white hover:text-green-600 dark:hover:text-green-400"
                  }`}
                >
                  Publicar Producto
                </Link>
              </li>
              {isAdmin && (
                <>
                  <li>
                    <Link
                      href="/admin/dashboard"
                      className={`block py-2 px-3 rounded md:p-0 ${
                        isActiveLink("/admin/dashboard")
                          ? "text-green-600 font-bold dark:text-green-400"
                          : "text-black dark:text-white hover:text-green-600 dark:hover:text-green-400"
                      }`}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/admin/users`}
                      className={`block py-2 px-3 rounded md:p-0 ${
                        isActiveLink("/admin/users")
                          ? "text-green-600 font-bold dark:text-green-400"
                          : "text-black dark:text-white hover:text-green-600 dark:hover:text-green-400"
                      }`}
                    >
                      Usuarios
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/products"
                      className={`block py-2 px-3 rounded md:p-0 ${
                        isActiveLink("/admin/products")
                          ? "text-green-600 font-bold dark:text-green-400"
                          : "text-black dark:text-white hover:text-green-600 dark:hover:text-green-400"
                      }`}
                    >
                      Productos
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          <label className="inline-flex items-center relative mr-2 ">
            <input
              className="peer hidden"
              id="toggle"
              type="checkbox"
              checked={isDarkMode}
              onChange={handleDarkModeChange}
            />
            <div className="relative w-[110px]  h-[40px] bg-white peer-checked:bg-zinc-500 rounded-full after:absolute after:content-[''] after:w-[40px] after:h-[30px] after:bg-gradient-to-r from-orange-500 to-yellow-400 peer-checked:after:from-zinc-900 peer-checked:after:to-zinc-900 after:rounded-full after:top-[5px] after:left-[5px] active:after:w-[50px] peer-checked:after:left-[105px] peer-checked:after:translate-x-[-100%] shadow-sm duration-300 after:duration-300 after:shadow-md "></div>
            <svg
              height="0"
              width="100"
              viewBox="0 0 24 24"
              data-name="Layer 1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-white peer-checked:opacity-60 absolute w-6 h-5 left-[13px] "
            >
              <path d="M12,17c-2.76,0-5-2.24-5-5s2.24-5,5-5,5,2.24,5,5-2.24,5-5,5ZM13,0h-2V5h2V0Zm0,19h-2v5h2v-5ZM5,11H0v2H5v-2Zm19,0h-5v2h5v-2Zm-2.81-6.78l-1.41-1.41-3.54,3.54,1.41,1.41,3.54-3.54ZM7.76,17.66l-1.41-1.41-3.54,3.54,1.41,1.41,3.54-3.54Zm0-11.31l-3.54-3.54-1.41,1.41,3.54,3.54,1.41-1.41Zm13.44,13.44l-3.54-3.54-1.41,1.41,3.54,3.54,1.41-1.41Z"></path>
            </svg>
            <svg
              height="512"
              width="512"
              viewBox="0 0 24 24"
              data-name="Layer 1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-black opacity-60 peer-checked:opacity-70 peer-checked:fill-white absolute w-6 h-5 right-[13px]"
            >
              <path d="M12.009,24A12.067,12.067,0,0,1,.075,10.725,12.121,12.121,0,0,1,10.1.152a13,13,0,0,1,5.03.206,2.5,2.5,0,0,1,1.8,1.8,2.47,2.47,0,0,1-.7,2.425c-4.559,4.168-4.165,10.645.807,14.412h0a2.5,2.5,0,0,1-.7,4.319A13.875,13.875,0,0,1,12.009,24Zm.074-22a10.776,10.776,0,0,0-1.675.127,10.1,10.1,0,0,0-8.344,8.8A9.928,9.928,0,0,0,4.581,18.7a10.473,10.473,0,0,0,11.093,2.734.5.5,0,0,0,.138-.856h0C9.883,16.1,9.417,8.087,14.865,3.124a.459.459,0,0,0,.127-.465.491.491,0,0,0-.356-.362A10.68,10.68,0,0,0,12.083,2ZM20.5,12a1,1,0,0,1-.97-.757l-.358-1.43L17.74,9.428a1,1,0,0,1,.035-1.94l1.4-.325.351-1.406a1,1,0,0,1,1.94,0l.355,1.418,1.418.355a1,1,0,0,1,0,1.94l-1.418.355-.355,1.418A1,1,0,0,1,20.5,12ZM16,14a1,1,0,0,0,2,0A1,1,0,0,0,16,14Zm6,4a1,1,0,0,0,2,0A1,1,0,0,0,22,18Z"></path>
            </svg>
          </label>

          <div className="space-x-3 flex items-center">
            {userName ? (
              <>
                <div className="relative group">
                  <div className="flex items-center dark:hover:bg-black hover:bg-gray-100 hover:rounded hover:cursor-pointer p-2">
                    <span className="text-gray-900 mt-2 mr-2 dark:text-white">
                      {userName}
                    </span>
                    {/* <img src="/img/henry.jpg" alt="User Avatar" className="w-[30px] h-10 rounded-full" /> */}
                    {isDarkMode ? (
                      <>
                        <Image
                          src="/img/arrow-down-white.svg"
                          alt="Arrow Down"
                          width={20}
                          height={20}
                        />
                      </>
                    ) : (
                      <>
                        <Image
                          src="/img/arrow-down.svg"
                          alt="Arrow Down"
                          width={20}
                          height={20}
                        />
                      </>
                    )}
                  </div>

                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    <ul className="py-2">
                      <li className="px-4 py-2 hover:bg-gray-100">
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 text-gray-700"
                        >
                          <Image
                            src="/img/profile.svg"
                            alt="profile"
                            width={16}
                            height={16}
                          />
                          Perfil
                        </Link>
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100">
                        <a
                          href="#"
                          className="flex items-center gap-2 text-gray-700"
                          onClick={handleLogout}
                        >
                          <Image
                            src="/img/logout.svg"
                            alt="logout"
                            width={16}
                            height={16}
                          />
                          Cerrar sesión
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                {/* Botón de Notificaciones */}
                <div className="relative">
                  <button
                    onClick={() => setIsModalNotificationOpen(true)}
                    className="relative p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <Bell className="h-6 w-6 text-gray-700 dark:text-gray-200" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5">
                        {notifications.length}
                      </span>
                    )}
                  </button>
                </div>

                <div className="relative">
                  {/* Botón de Chat */}
                  <button
                    onClick={() => setIsModalChatOpen(!isModalChatOpen)}
                    className="relative p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <MessageCircle className="h-6 w-6 text-gray-700 dark:text-gray-200" />
                  </button>

                  {/* Cuadro desplegable de mensajes */}
                  {isModalChatOpen && (
                    <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-900 rounded-md shadow-lg z-50">
                      <div className="flex justify-between items-center border-b pb-2 px-4 py-2">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Chats
                        </h2>
                        <button
                          onClick={() => setIsModalChatOpen(false)}
                          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          <X className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                        </button>
                      </div>
                      <div className="mt-4 max-h-64 overflow-y-auto px-4">
                        {chats.length > 0 ? (
                          chats.map((chat, index) => (
                            <div
                              key={index}
                              className="p-2 border-b last:border-none dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                              onClick={() => handleChatClick(chat)} // Llama a handleChatClick
                            >
                              <p className="text-sm text-gray-800 dark:text-gray-300">
                                <strong>{chat.senderName || "Usuario"}:</strong> {chat.content}
                              </p>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(chat.timestamp).toLocaleString()}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-gray-500 dark:text-gray-400">
                            No tienes chats.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {activeChat && (
  <div className="fixed bottom-4 left-4 w-80 bg-white dark:bg-gray-900 rounded-lg shadow-lg z-50">
    <div className="flex justify-between items-center border-b p-2">
      <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
        Chat con {activeChat.senderId || "Usuario"}
      </h2>
      <button
        onClick={() => setActiveChat(null)} // Cierra el chat activo
        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <X className="h-5 w-5 text-gray-700 dark:text-gray-200" />
      </button>
    </div>
    <div className="p-2 max-h-64 overflow-y-auto">
      {activeChatMessages.map((msg, index) => (
        <div key={index} className="mb-2">
          <strong>{msg.senderId === activeChat.senderId ? "Tú" : "Ellos"}:</strong> {msg.content}
        </div>
      ))}
    </div>
    <div className="p-2 border-t">
      <input
        type="text"
        placeholder="Escribe un mensaje..."
        className="w-full p-2 border rounded"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            // sendMessage(e.currentTarget.value);
            // e.currentTarget.value = "";
          }
        }}
      />
    </div>
  </div>
)}

                {/* Modal de Notificaciones */}
                {isModalNotificationOpen && (
                  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-96 shadow-lg">
                      <div className="flex justify-between items-center border-b pb-2">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Notificaciones
                        </h2>
                        <button
                          onClick={() => setIsModalNotificationOpen(false)}
                          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          <X className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                        </button>
                      </div>
                      <div className="mt-4 max-h-64 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notification, index) => (
                            <div
                              key={index}
                              className="p-2 border-b last:border-none dark:border-gray-700"
                            >
                              <p className="text-sm text-gray-800 dark:text-gray-300">
                                {notification.message}
                              </p>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {notification.timestamp}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-gray-500 dark:text-gray-400">
                            No tienes notificaciones.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-900 hover:text-green-700 dark:text-white"
                >
                  Iniciar Sesión
                </Link>
                <span className="text-black dark:text-white">/</span>
                <Link
                  href="/register"
                  className="text-green-500 hover:text-green-700"
                >
                  Registrate
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
