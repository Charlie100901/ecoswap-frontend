"use client";
import { useState } from 'react';
import config from '@/config';

interface PredictionResult {
  probability: number;
  prediction: boolean;
  message: string;
  confidenceLevel: string;
}

interface ManualPredictionFormProps {
  onPredictionResult: (result: PredictionResult) => void;
}

export default function ManualPredictionForm({ onPredictionResult }: ManualPredictionFormProps) {
  const [formData, setFormData] = useState({
    productToId: '',
    daysPublished: '',
    interactions: '',
    userSuccessHistory: '',
    userRatingCategory: '',
    location: ''
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.apiBaseUrl}/api/v1/prediction-manual`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productToId: parseInt(formData.productToId),
          daysPublished: parseInt(formData.daysPublished),
          interactions: parseInt(formData.interactions),
          userSuccessHistory: parseFloat(formData.userSuccessHistory),
          userRatingCategory: formData.userRatingCategory,
          location: formData.location
        })
      });

      if (!response.ok) {
        throw new Error('Error al obtener la predicción');
      }

      const result = await response.json();
      onPredictionResult(result);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md max-w-md mx-auto">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Predicción Manual
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Ingresa los datos del producto para obtener una predicción de éxito del intercambio
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ID Producto
            </label>
            <input
              type="number"
              value={formData.productToId}
              onChange={(e) => setFormData({ ...formData, productToId: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-zinc-700 dark:text-white text-sm"
              required
              placeholder="ID del producto"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Días Publicado
            </label>
            <input
              type="number"
              value={formData.daysPublished}
              onChange={(e) => setFormData({ ...formData, daysPublished: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-zinc-700 dark:text-white text-sm"
              required
              placeholder="Número de días"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Interacciones
            </label>
            <input
              type="number"
              value={formData.interactions}
              onChange={(e) => setFormData({ ...formData, interactions: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-zinc-700 dark:text-white text-sm"
              required
              placeholder="Número de interacciones"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Historial
            </label>
            <input
              type="number"
              value={formData.userSuccessHistory}
              onChange={(e) => setFormData({ ...formData, userSuccessHistory: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-zinc-700 dark:text-white text-sm"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Calificación
          </label>
          <select
            value={formData.userRatingCategory}
            onChange={(e) => setFormData({ ...formData, userRatingCategory: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-zinc-700 dark:text-white text-sm"
            required
          >
            <option value="">Seleccione una categoría</option>
            <option value="bueno">Bueno</option>
            <option value="regular">Regular</option>
            <option value="malo">Malo</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Ubicación
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-zinc-700 dark:text-white text-sm"
            required
            placeholder="medellin - santa marta - cartagena"
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Realizar Predicción
        </button>
      </form>
    </div>
  );
} 