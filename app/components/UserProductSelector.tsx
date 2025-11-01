"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Product, productService } from '@/app/services/productService';

interface UserProductSelectorProps {
  onProductSelect: (product: Product) => void;
  selectedProductId?: number;
  className?: string;
}

export default function UserProductSelector({ 
  onProductSelect, 
  selectedProductId,
  className = ""
}: UserProductSelectorProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userId = productService.getCurrentUserId();
      if (!userId) {
        setError('No se pudo obtener el ID del usuario. Por favor, inicia sesión.');
        return;
      }

      const userProducts = await productService.getUserActiveProducts(userId);
      setProducts(userProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar productos');
      console.error('Error fetching user products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProducts();
  }, [fetchUserProducts]);

  if (loading) {
    return (
      <div className={`flex justify-center items-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando tus productos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center p-8 ${className}`}>
        <div className="mb-4">
          <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={fetchUserProducts}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={`text-center p-8 ${className}`}>
        <div className="mb-4">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No tienes productos activos
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Necesitas tener al menos un producto publicado para crear intercambios con productos existentes.
        </p>
        <a 
          href="/UploadProduct"
          className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Publicar mi primer producto
        </a>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Selecciona uno de tus productos ({products.length})
        </h3>
        <button 
          onClick={fetchUserProducts}
          className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualizar
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => onProductSelect(product)}
            className={`cursor-pointer border-2 rounded-lg p-4 transition-all duration-200 hover:shadow-lg ${
              selectedProductId === product.id
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-md'
                : 'border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-400'
            }`}
          >
            <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
              {product.imageProduct ? (
                <Image
                  src={product.imageProduct}
                  alt={product.title}
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              
              {selectedProductId === product.id && (
                <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1 shadow-lg">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1 truncate" title={product.title}>
              {product.title}
            </h4>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2" title={product.description}>
              {product.description}
            </p>
            
            <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
              <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded truncate">
                {product.category}
              </span>
              <span>
                {new Date(product.releaseDate).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit'
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}