import config from '@/config';

export interface Product {
  id: number;
  title: string;
  description: string;
  imageProduct: string;
  category: string;
  conditionProduct: string;
  releaseDate: string;
  user: {
    id: number;
    name: string;
    email: string;
    address: string;
    cellphoneNumber: string;
  };
}

export interface ExchangeRequest {
  productFromId: number;
  productToId: number;
  userFromId: number;
  userToId: number;
  message?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  total?: number;
}

export interface ChatRequest {
  message: string;
  userId: number;
}

export interface ChatResponse {
  response: string;
  timestamp: string;
  status: string;
}

class ProductService {
  private baseUrl = config.apiBaseUrl;

  /**
   * Obtiene los productos activos de un usuario específico
   * GET /api/v1/product/active/user/{userId}
   */
  async getUserActiveProducts(userId: number): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/product/active/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Agregar token de autenticación si es necesario
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: Product[] = await response.json();
      console.log('User products received:', data);
      return data;
    } catch (error) {
      console.error('Error fetching user active products:', error);
      throw error;
    }
  }

  /**
   * Crea un intercambio entre dos productos existentes
   * POST /api/v1/create-exchange-existing-product
   */
  async createExchangeWithExistingProduct(exchangeData: ExchangeRequest): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/create-exchange-existing-product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(exchangeData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating exchange:', error);
      throw error;
    }
  }

  /**
   * Obtiene el token de autenticación del localStorage
   */
  private getAuthToken(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || '';
    }
    return '';
  }

  /**
   * Obtiene el ID del usuario actual del localStorage
   */
  getCurrentUserId(): number | null {
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('userId');
      return userId ? parseInt(userId) : null;
    }
    return null;
  }

  /**
   * Envía un mensaje al chatbot asistente
   * POST /chat/assistant
   */
  async sendChatMessage(message: string, userId: number): Promise<ChatResponse> {
    try {
      const chatData: ChatRequest = {
        message: message.trim(),
        userId: userId
      };

      const response = await fetch(`${this.baseUrl}/chat/assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(chatData),
      });

      if (!response.ok) {
        // Intentar obtener el mensaje de error
        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        try {
          const errorText = await response.text();
          if (errorText) {
            errorMessage = errorText;
          }
        } catch (e) {
          // Si no se puede leer el error, usar el mensaje por defecto
        }
        throw new Error(errorMessage);
      }

      const data: ChatResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  }
}

export const productService = new ProductService();