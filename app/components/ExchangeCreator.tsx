"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Product, ExchangeRequest, productService } from '@/app/services/productService';
import UserProductSelector from './UserProductSelector';
import { useRouter } from 'next/navigation';

interface ExchangeCreatorProps {
  targetProduct: Product; // El producto que el usuario quiere obtener
  onExchangeCreated?: (exchange: any) => void;
  onClose?: () => void;
}

export default function ExchangeCreator({ targetProduct, onExchangeCreated, onClose }: ExchangeCreatorProps) {
  const [selectedUserProduct, setSelectedUserProduct] = useState<Product | null>(null);
  const [exchangeType, setExchangeType] = useState<'existing' | 'new'>('existing');
  const [message, setMessage] = useState('');
  const [isCreatingExchange, setIsCreatingExchange] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCreateExchange = async () => {
    if (!selectedUserProduct) {
      setError('Por favor selecciona un producto para intercambiar');
      return;
    }

    const currentUserId = productService.getCurrentUserId();
    if (!currentUserId) {
      setError('No se pudo obtener el ID del usuario');
      return;
    }

    // Validar que el producto objetivo tenga usuario
    if (!targetProduct.user || !targetProduct.user.id) {
      console.error('Target product:', targetProduct);
      setError('El producto objetivo no tiene información de usuario válida');
      return;
    }

    try {
      setIsCreatingExchange(true);
      setError(null);

      const exchangeData: ExchangeRequest = {
        productFromId: selectedUserProduct.id,
        productToId: targetProduct.id,
        userFromId: currentUserId,
        userToId: targetProduct.user.id,
        message: message.trim()
      };

      console.log('Exchange data to send:', exchangeData);

      const result = await productService.createExchangeWithExistingProduct(exchangeData);
      
      if (onExchangeCreated) {
        onExchangeCreated(result);
      }

      // Mostrar mensaje de éxito
      alert('¡Intercambio creado exitosamente!');
      
      if (onClose) {
        onClose();
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el intercambio');
    } finally {
      setIsCreatingExchange(false);
    }
  };

  const handleProductSelect = (product: Product) => {
    setSelectedUserProduct(product);
    setError(null);
  };

  const handleCreateNewProduct = () => {
    router.push(`/UploadProduct?productTo=${targetProduct.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Crear Intercambio
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Producto objetivo */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Producto que deseas obtener:
        </h3>
        <div className="flex items-center space-x-4">
          <div className="relative w-20 h-20 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden">
            {targetProduct.imageProduct ? (
              <Image
                src={targetProduct.imageProduct}
                alt={targetProduct.title}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/img/placeholder.jpg';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">{targetProduct.title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{targetProduct.description}</p>
            <span className="inline-block mt-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
              {targetProduct.category}
            </span>
          </div>
        </div>
      </div>

      {/* Selector de tipo de intercambio */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          ¿Cómo quieres crear el intercambio?
        </h3>
        <div className="flex space-x-4">
          <button
            onClick={() => setExchangeType('existing')}
            className={`flex-1 p-4 border-2 rounded-lg text-left transition-all ${
              exchangeType === 'existing'
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-200 dark:border-gray-600 hover:border-green-300'
            }`}
          >
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="font-medium">Usar producto existente</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Selecciona uno de tus productos ya publicados para el intercambio
            </p>
          </button>
          
          <button
            onClick={() => setExchangeType('new')}
            className={`flex-1 p-4 border-2 rounded-lg text-left transition-all ${
              exchangeType === 'new'
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-200 dark:border-gray-600 hover:border-green-300'
            }`}
          >
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-medium">Crear nuevo producto</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Publica un nuevo producto específicamente para este intercambio
            </p>
          </button>
        </div>
      </div>

      {/* Contenido según el tipo seleccionado */}
      {exchangeType === 'existing' ? (
        <div className="mb-6">
          <UserProductSelector
            onProductSelect={handleProductSelect}
            selectedProductId={selectedUserProduct?.id}
            className="border rounded-lg p-4"
          />
        </div>
      ) : (
        <div className="mb-6 p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Crear nuevo producto
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Serás redirigido al formulario para publicar un nuevo producto específicamente para este intercambio
          </p>
          <button
            onClick={handleCreateNewProduct}
            className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            Ir a publicar producto
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Botones de acción */}
      {exchangeType === 'existing' && (
        <div className="flex justify-end space-x-4">
          {onClose && (
            <button
              onClick={onClose}
              disabled={isCreatingExchange}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
          )}
          <button
            onClick={handleCreateExchange}
            disabled={!selectedUserProduct || isCreatingExchange}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors flex items-center"
          >
            {isCreatingExchange ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creando intercambio...
              </>
            ) : (
              'Crear intercambio'
            )}
          </button>
        </div>
      )}
    </div>
  );
}