/*
 * ЗАДАЧА 4: Создание интерфейсов для API responses
 * 
 * Инструкции:
 * 1. Переименуйте файл в .ts
 * 2. Создайте интерфейсы для всех API ответов
 * 3. Типизируйте все функции работы с API
 * 4. Обработайте все возможные состояния загрузки и ошибок
 */

interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
}

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    category: string;
    images: string[];
    rating?: number;
}

interface OrderItem {
    productId: number;
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    userId: number;
    items: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
    createdAt: string; // Assuming ISO date string
}

interface ApiResponse<T> {
    data?: T | null;
    success: boolean;
    message?: string;
    error?: string | null;
}

type UserRole = 'admin' | 'customer' | 'manager';
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

// Система работы с API интернет-магазина

// TODO: Создать интерфейсы для API ответов:
// - ApiResponse<T>: data?, success, message?, error?
// - User: id, name, email, role, avatar?
// - Product: id, name, price, description, category, images[], rating?
// - Order: id, userId, items[], totalAmount, status, createdAt
// - OrderItem: productId, quantity, price

// TODO: Создать union типы:
// - UserRole: 'admin' | 'customer' | 'manager'
// - OrderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

// Базовая функция для API запросов
async function makeApiRequest<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(url, options);
        const data: T = await response.json();
        
        if (!response.ok) {
            return {
                success: false,
                error: (data as any).message || 'Произошла ошибка',
                data: null
            };
        }
        
        return {
            success: true,
            data: data,
            error: null
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || 'Неизвестная ошибка',
            data: null
        };
    }
}

// Получение пользователя по ID
async function getUser(userId: number): Promise<ApiResponse<User>> {
    return makeApiRequest<User>(`/api/users/${userId}`, {
        method: 'GET'
    });
}

interface ProductFilters {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
}

// Получение списка товаров с фильтрами
async function getProducts(filters: ProductFilters): Promise<ApiResponse<Product[]>> {
    const queryParams = new URLSearchParams();
    
    if (filters.category) queryParams.set('category', filters.category);
    if (filters.minPrice) queryParams.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) queryParams.set('maxPrice', filters.maxPrice.toString());
    if (filters.search) queryParams.set('search', filters.search);
    
    return makeApiRequest(`/api/products?${queryParams}`, {
        method: 'GET'
    });
}

interface CreateOrderData {
    userId: number;
    items: Omit<OrderItem, 'price'>[]; // Price will be calculated on backend
    totalAmount: number;
}

// Создание заказа
async function createOrder(orderData: CreateOrderData): Promise<ApiResponse<Order>> {
    return makeApiRequest<Order>('/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    });
}

// Обновление статуса заказа
async function updateOrderStatus(orderId: number, newStatus: OrderStatus): Promise<ApiResponse<Order>> {
    return makeApiRequest<Order>(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
    });
}

// Функция для обработки результатов API
function handleApiResponse<T>(response: ApiResponse<T>, onSuccess: (data: T | null) => void, onError: (error: string | null) => void) {
    if (response.success && response.data !== null) {
        onSuccess(response.data ?? null);
    } else {
        onError(response.error || 'Неизвестная ошибка');
    }
}

// Класс для управления состоянием загрузки
class ApiState<T> {
    isLoading: boolean;
    error: string | null;
    data: T | null;

    constructor() {
        this.isLoading = false;
        this.error = null;
        this.data = null;
    }
    
    setLoading(loading: boolean) {
        this.isLoading = loading;
        if (loading) {
            this.error = null;
        }
    }
    
    setData(data: T | null) {
        this.data = data;
        this.isLoading = false;
        this.error = null;
    }
    
    setError(error: string) {
        this.error = error;
        this.isLoading = false;
        this.data = null;
    }
    
    getState() {
        return {
            isLoading: this.isLoading,
            error: this.error,
            data: this.data
        };
    }
}

// Композитная функция для загрузки данных с состоянием
async function loadDataWithState<T>(apiCall: () => Promise<ApiResponse<T>>, state: ApiState<T>): Promise<ApiResponse<T>> {
    state.setLoading(true);
    
    try {
        const response = await apiCall();
        
        if (response.success) {
            state.setData(response.data ?? null);
        } else {
            state.setError(response.error || 'Неизвестная ошибка');
        }
        
        return response;
    } catch (error: any) {
        state.setError(error.message);
        return {
            success: false,
            error: error.message,
            data: null
        };
    }
}

// Примеры использования
async function exampleUsage() {
    const userState = new ApiState<User>();
    const productsState = new ApiState<Product[]>();
    
    console.log('Загружаем пользователя...');
    await loadDataWithState(() => getUser(1), userState);
    console.log('Состояние пользователя:', userState.getState());
    
    console.log('Загружаем товары...');
    await loadDataWithState(() => getProducts({ 
        category: 'electronics', 
        minPrice: 1000 
    }), productsState);
    console.log('Состояние товаров:', productsState.getState());
    
    console.log('Создаем заказ...');
    const orderResponse = await createOrder({
        userId: 1,
        items: [
            { productId: 101, quantity: 1 }, // Price removed as it's calculated on backend
            { productId: 102, quantity: 2 }  // Price removed as it's calculated on backend
        ],
        totalAmount: 3100
    });
    
    handleApiResponse<Order>(
        orderResponse,
        (order) => console.log('Заказ создан:', order),
        (error) => console.error('Ошибка создания заказа:', error)
    );
}

// Раскомментируйте для тестирования (не будет работать без реального API)
// exampleUsage();