"use client";
import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import config from "@/config";

interface ChatMessage {
  id: number;
  sender: { id: number; name: string };
  receiver: { id: number; name: string };
  content: string;
  timestamp: string;
  exchange: { id: number };
}

export default function ChatDropdown() {
  const [isModalChatOpen, setIsModalChatOpen] = useState(false);
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [activeChat, setActiveChat] = useState<ChatMessage | null>(null);
  const [activeChatMessages, setActiveChatMessages] = useState<ChatMessage[]>(
    []
  );

  useEffect(() => {
    const fetchChats = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const response = await fetch(
          `${config.apiBaseUrl}/api/v1/chat/message/exchange/${userId}`
        );
        if (!response.ok) {
          throw new Error("Error al obtener los chats");
        }
        const data: ChatMessage[] = await response.json();

        const groupedChats = Object.values(
          data.reduce((acc, message) => {
            const exchangeId = message.exchange.id;
            if (
              !acc[exchangeId] ||
              new Date(message.timestamp) > new Date(acc[exchangeId].timestamp)
            ) {
              acc[exchangeId] = message; 
            }
            return acc;
          }, {} as Record<number, ChatMessage>)
        );

        setChats(groupedChats);
      } catch (error) {
        console.error("Error al obtener los chats:", error);
      }
    };

    if (isModalChatOpen) {
      fetchChats();
    }
  }, [isModalChatOpen]);

  const fetchActiveChatMessages = async (chat: ChatMessage) => {
    try {
      const userId = Number(localStorage.getItem("userId"));
      const response = await fetch(
        `${config.apiBaseUrl}/api/v1/chat/message?sender=${chat.sender.id}&receiver=${userId}`
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
  
  useEffect(() => {
    let pollingInterval: NodeJS.Timeout | null = null;
  
    if (activeChat) {
      fetchActiveChatMessages(activeChat); 
      pollingInterval = setInterval(() => {
        fetchActiveChatMessages(activeChat);
      }, 5000); 
    }
  
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [activeChat]);

  const handleChatClick = (chat: ChatMessage) => {
    setActiveChat(chat);
    fetchActiveChatMessages(chat);
  };

  const sendMessage = async (content: string) => {
    if (!activeChat) {
      console.error("No hay un chat activo para enviar el mensaje.");
      return;
    }

    try {
      const newMessage = {
        senderId: localStorage.getItem("userId"),
        receiverId: activeChat.sender.id,
        content,
        exchangeId: activeChat.exchange.id,
        timestamp: new Date().toISOString(),
      };

      const response = await fetch(
        `${config.apiBaseUrl}/api/v1/chat/message/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(newMessage),
        }
      );

      if (!response.ok) {
        throw new Error("Error al enviar el mensaje");
      }

      await fetchActiveChatMessages(activeChat);
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
    }
  };

  return (
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
                  onClick={() => handleChatClick(chat)}
                >
                  <p className="text-sm text-gray-800 dark:text-gray-300">
                    <strong>{chat.sender.name || "Usuario"}:</strong>{" "}
                    {chat.content}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(chat.timestamp).toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 h-11 dark:text-gray-400">
                No tienes chats.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Chat activo */}
      {activeChat && (
        <div className="fixed bottom-4 left-4 w-80 bg-white dark:bg-gray-900 rounded-lg shadow-lg z-50">
          <div className="flex justify-between items-center border-b p-2">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
              Chat con {activeChat.sender.name || "Usuario"}
            </h2>
            <button
              onClick={() => setActiveChat(null)}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5 text-gray-700 dark:text-gray-200" />
            </button>
          </div>
          <div className="p-2 max-h-64 overflow-y-auto">
            {activeChatMessages.map((msg, index) => {
              const isCurrentUser =
                msg.sender.id === Number(localStorage.getItem("userId"));
              return (
                <div
                  key={index}
                  className={`mb-2 flex ${
                    isCurrentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      isCurrentUser
                        ? "bg-green-500 text-white text-right"
                        : "bg-gray-200 text-black text-left"
                    } max-w-[70%]`}
                  >
                    {!isCurrentUser && (
                      <p className="text-xs font-semibold text-gray-700 mb-1">
                        {msg.sender.name}
                      </p>
                    )}
                    <p>{msg.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="p-2 border-t">
            <input
              type="text"
              placeholder="Escribe un mensaje..."
              className="w-full p-2 border rounded"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage(e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}