"use client";

import { useState, useRef, useEffect } from 'react';
import { productService, ChatResponse } from '@/app/services/productService';

interface ChatMessage {
  id: number;
  message: string;
  isUser: boolean;
  timestamp: Date;
  isLoading?: boolean;
}

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatBot({ isOpen, onClose }: ChatBotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      message: "¡Hola! 👋 Soy el Asistente EcoSwap, tu aliado para intercambios sostenibles. ♻️\n\n¿En qué puedo ayudarte hoy? Puedes preguntarme sobre productos disponibles, qué puedes intercambiar, o cualquier duda sobre nuestra plataforma.",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Enfocar el input cuando se abre el chat
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    const message = inputMessage.trim();
    if (!message || isLoading) return;

    const userId = productService.getCurrentUserId();
    if (!userId) {
      alert('Error: No se pudo obtener el ID del usuario');
      return;
    }

    // Agregar mensaje del usuario
    const userMessage: ChatMessage = {
      id: Date.now(),
      message,
      isUser: true,
      timestamp: new Date(),
    };

    // Agregar mensaje de "escribiendo..."
    const loadingMessage: ChatMessage = {
      id: Date.now() + 1,
      message: 'Escribiendo...',
      isUser: false,
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response: ChatResponse = await productService.sendChatMessage(message, userId);
      
      // Remover mensaje de carga y agregar respuesta real
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isLoading);
        return [...filtered, {
          id: Date.now() + 2,
          message: response.response,
          isUser: false,
          timestamp: new Date(response.timestamp),
        }];
      });
    } catch (error) {
      // Remover mensaje de carga y mostrar error
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isLoading);
        return [...filtered, {
          id: Date.now() + 2,
          message: `Lo siento, hubo un error al procesar tu mensaje. ${error instanceof Error ? error.message : 'Por favor intenta de nuevo.'}`,
          isUser: false,
          timestamp: new Date(),
        }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessage = (message: string) => {
    return message.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < message.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed bottom-20 right-6 z-50 w-80 h-96 sm:w-96 sm:h-[500px] transition-all duration-300 transform ${
      isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
    }`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-600 w-full h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-600 bg-green-50 dark:bg-green-900/20 rounded-t-lg">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Asistente EcoSwap</h3>
              <p className="text-xs text-green-600 dark:text-green-400">En línea</p>
            </div>
          </div>
          <div className="flex space-x-1">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Minimizar chat"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.isUser
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                {msg.isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-500">Escribiendo...</span>
                  </div>
                ) : (
                  <>
                    <div className="text-sm">{formatMessage(msg.message)}</div>
                    <div className={`text-xs mt-1 ${msg.isUser ? 'text-green-100' : 'text-gray-500 dark:text-gray-400'}`}>
                      {formatTime(msg.timestamp)}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              disabled={isLoading}
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          
          {/* Sugerencias rápidas */}
          <div className="mt-2 flex flex-wrap gap-1">
            {['Productos disponibles', 'Cómo intercambiar', 'Ayuda'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInputMessage(suggestion === 'Productos disponibles' ? '¿Qué productos hay disponibles?' : suggestion === 'Cómo intercambiar' ? '¿Cómo funciona el intercambio?' : 'Ayuda')}
                disabled={isLoading}
                className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full transition-colors disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}