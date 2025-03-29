import { useEffect, useState } from "react";
import config from "@/config";

interface ChatMessage {
  id?: number;
  senderId: number; // ID del usuario que envía el mensaje
  receiverId: number; // ID del usuario que recibe el mensaje
  content: string;
  exchangeId?: number; // ID del intercambio
  timestamp: string; // Fecha y hora del mensaje
}

export const useChat = (senderId: number, receiverId: number, exchangeId: number) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener historial de mensajes entre senderId y receiverId
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `${config.apiBaseUrl}/api/v1/chat/message?sender=${senderId}&receiver=${receiverId}`
        );
        if (!response.ok) {
          throw new Error("Error al obtener los mensajes");
        }
        const data: ChatMessage[] = await response.json();
        setMessages(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [senderId, receiverId]);

  // Obtener mensajes por exchangeId usando senderId
  const fetchMessagesByExchangeId = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${config.apiBaseUrl}/api/v1/chat/message/exchange/${senderId}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener los mensajes por exchangeId");
      }
      const data: ChatMessage[] = await response.json();
      setMessages(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Enviar un mensaje
  const sendMessage = async (content: string) => {
    try {
      const newMessage: ChatMessage = {
        senderId: senderId,
        receiverId: receiverId,
        content,
        exchangeId, // Incluye el exchangeId
        timestamp: new Date().toISOString(),
      };

      const response = await fetch(`${config.apiBaseUrl}/api/v1/chat/message/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage),
      });

      if (!response.ok) {
        throw new Error("Error al enviar el mensaje");
      }

      setMessages((prev) => [...prev, newMessage]);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return { messages, sendMessage, fetchMessagesByExchangeId, loading, error };
};