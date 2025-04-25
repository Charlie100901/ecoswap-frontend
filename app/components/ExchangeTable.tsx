"use client";
import { useEffect, useState } from 'react';
import config from '@/config';
import Image from 'next/image';
import { X } from 'lucide-react';
import ManualPredictionForm from './ManualPredictionForm';

interface User {
  id: number;
  name: string;
}

interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  productStatus: string;
  conditionProduct: string;
  imageProduct: string;
  user: User;
}

interface ExchangeDTO {
  id: number;
  productFrom: Product;
  productTo: Product;
  status: string;
  exchangeRequestedAt: string;
  exchangeRespondedAt: string | null;
}


interface PredictionRequestBody {
  id: number;
  productFrom: {
    id: number;
  };
  productTo: {
    id: number;
  };
  status: string;
  exchangeRequestedAt: string;
  exchangeRespondedAt: string;
}

interface PredictionResult {
  probability: number;
  prediction: boolean;
  message: string;
  confidenceLevel: string
}

export default function ExchangeTable() {
  const [exchanges, setExchanges] = useState<ExchangeDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [predictingExchange, setPredictingExchange] = useState<ExchangeDTO | null>(null);
  const [showManualForm, setShowManualForm] = useState(false);

  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        let headers: HeadersInit = {
          'Content-Type': 'application/json'
        };

        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('token');
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }
        }

        const response = await fetch(`${config.apiBaseUrl}/api/v1/exchanges`, {
          headers
        });
        
        if (!response.ok) {
          throw new Error('Error al cargar los intercambios');
        }
        const data = await response.json();
        setExchanges(data);
      } catch (err) {
        console.error('Error detallado:', err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchExchanges();
  }, []);

  const handlePrediction = async (exchange: ExchangeDTO) => {
    try {
      setPredictingExchange(exchange);
      const requestBody: PredictionRequestBody = {
        id: exchange.id,
        productFrom: {
          id: exchange.productFrom.id
        },
        productTo: {
          id: exchange.productTo.id
        },
        status: exchange.status,
        exchangeRequestedAt: exchange.exchangeRequestedAt,
        exchangeRespondedAt: exchange.exchangeRespondedAt || exchange.exchangeRequestedAt
      };

      const token = localStorage.getItem('token');
      const response = await fetch(`${config.apiBaseUrl}/api/v1/prediction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('Error al obtener la predicción');
      }

      const result = await response.json();
      console.log(result);
      setPredictionResult(result);
      setShowModal(true);
      
    } catch (err) {
      console.error('Error al realizar la predicción:', err);
      setPredictionResult(null);
      setShowModal(true);
    }
  };

  const handleManualPredictionResult = (result: PredictionResult) => {
    setPredictionResult(result);
    setShowModal(true);
    setShowManualForm(false);
  };

  const PredictionModal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 max-w-md w-full mx-4 relative">
          <button 
            onClick={() => setShowModal(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>

          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Resultado de la Predicción
          </h3>

          {predictionResult ? (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-zinc-700 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Detalles del Intercambio
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-600 dark:text-gray-300">Producto Origen:</div>
                  <div className="text-gray-900 dark:text-white">{predictingExchange?.productFrom.title}</div>
                  <div className="text-gray-600 dark:text-gray-300">Producto Destino:</div>
                  <div className="text-gray-900 dark:text-white">{predictingExchange?.productTo.title}</div>
                </div>
              </div>

              <div className={`bg-green-50  ${
                    predictionResult.prediction ? "dark:bg-green-900/20" : "dark:bg-red-900/20"}  p-4 rounded-lg`}>
                <h4 className="font-semibold text-green-900 dark:text-green-400 mb-2">
                  Predicción
                </h4>
                <div className="space-y-2">
                  <div className={`flex justify-between items-center`}>
                    <span className="text-green-800 dark:text-green-300">Resultado:</span>
                    <span className="font-bold text-green-900 dark:text-green-200">
                        {predictionResult.prediction ? 'True' : 'False'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-800 dark:text-green-300">Probabilidad:</span>
                    <span className="font-bold text-green-900 dark:text-green-200">
                      {(predictionResult.probability * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-800 dark:text-green-300">Mensaje:</span>
                    <span className="font-bold text-green-900 dark:text-green-200">
                        {predictionResult.message}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-800 dark:text-green-300">Nivel de confidencia:</span>
                    <span className="font-bold text-green-900 dark:text-green-200">
                        {predictionResult.confidenceLevel}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-red-600 dark:text-red-400">
              Error al obtener la predicción. Por favor, intente nuevamente.
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-gray-200 dark:bg-zinc-600 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-zinc-500 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 text-center">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Intercambios Disponibles
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          En esta vista puedes ver todos los intercambios disponibles. Para cada intercambio puedes:
        </p>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mt-2 space-y-1">
          <li>Ver los detalles del producto ofrecido y solicitado</li>
          <li>Obtener una predicción de éxito del intercambio</li>
        </ul>
      </div>

      {showManualForm && (
        <div className="mb-6">
          <ManualPredictionForm onPredictionResult={handleManualPredictionResult} />
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setShowManualForm(!showManualForm)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            <span>{showManualForm ? 'Ocultar' : 'Mostrar'} Predicción Manual</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-zinc-800 shadow-md rounded-lg">
          <thead className="bg-gray-50 dark:bg-zinc-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Producto Origen</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Producto Destino</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fecha Solicitud</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fecha Respuesta</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-zinc-700">
            {exchanges.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <svg 
                      className="w-12 h-12 text-gray-400 dark:text-gray-500" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
                      />
                    </svg>
                    <p className="text-lg font-medium">No hay intercambios disponibles</p>
                    <p className="text-sm">Los intercambios realizados aparecerán aquí</p>
                  </div>
                </td>
              </tr>
            ) : (
              exchanges.map((exchange) => (
                <tr key={exchange.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {exchange.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <Image
                          className="h-10 w-10 rounded-full"
                          src={exchange.productFrom.imageProduct}
                          alt={exchange.productFrom.title}
                          width={40}
                          height={40}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {exchange.productFrom.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {exchange.productFrom.user.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <Image
                          className="h-10 w-10 rounded-full"
                          src={exchange.productTo.imageProduct}
                          alt={exchange.productTo.title}
                          width={40}
                          height={40}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {exchange.productTo.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {exchange.productTo.user.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${exchange.status === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : 
                        exchange.status === 'completado' ? 'bg-green-100 text-green-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {exchange.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(exchange.exchangeRequestedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {exchange.exchangeRespondedAt ? 
                      new Date(exchange.exchangeRespondedAt).toLocaleDateString() : 
                      'Pendiente'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handlePrediction(exchange)}
                      className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors duration-200 flex items-center space-x-2"
                    >
                      <svg 
                        className="w-4 h-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                        />
                      </svg>
                      <span>Predicción</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <PredictionModal />
    </div>
  );
}