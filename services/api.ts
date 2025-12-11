import { Product, User, Order, UserRole, OrderStatus, AnalyticsData } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';

// --- MOCK DATABASE ---
const STORAGE_KEYS = {
  PRODUCTS: 'medihub_products',
  ORDERS: 'medihub_orders',
  USER: 'medihub_user',
};

// Initialize LS if empty
if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
}

if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
}

// --- HELPER ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- API ---
export const api = {
  products: {
    getAll: async (): Promise<Product[]> => {
      await delay(500);
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return data ? JSON.parse(data) : [];
    },
    getById: async (id: string): Promise<Product | undefined> => {
      await delay(300);
      const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
      return products.find((p: Product) => p.id === id);
    },
    create: async (product: Omit<Product, 'id'>): Promise<Product> => {
      await delay(500);
      const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
      const newProduct = { ...product, id: Math.random().toString(36).substr(2, 9) };
      products.push(newProduct);
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      return newProduct;
    },
    update: async (id: string, updates: Partial<Product>): Promise<Product> => {
      await delay(500);
      const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
      const index = products.findIndex((p: Product) => p.id === id);
      if (index === -1) throw new Error("Product not found");
      products[index] = { ...products[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      return products[index];
    },
    delete: async (id: string): Promise<void> => {
      await delay(500);
      const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
      const filtered = products.filter((p: Product) => p.id !== id);
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));
    }
  },

  orders: {
    create: async (order: Omit<Order, 'id' | 'date' | 'status'>): Promise<Order> => {
      await delay(800);
      const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
      const newOrder: Order = {
        ...order,
        id: `ORD-${Math.floor(Math.random() * 100000)}`,
        date: new Date().toISOString(),
        status: OrderStatus.PENDING
      };
      orders.unshift(newOrder); // Add to top
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      return newOrder;
    },
    getAll: async (): Promise<Order[]> => {
      await delay(500);
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    },
    updateStatus: async (id: string, status: OrderStatus): Promise<void> => {
        await delay(300);
        const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
        const index = orders.findIndex((o: Order) => o.id === id);
        if(index !== -1) {
            orders[index].status = status;
            localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
        }
    }
  },

  auth: {
    login: async (email: string, password: string): Promise<User> => {
      await delay(800);
      // Hardcoded for demo
      if (email === 'admin@medihub.africa' && password === 'admin123') {
        return {
          id: 'admin-1',
          name: 'MediHub Admin',
          email: 'admin@medihub.africa',
          role: UserRole.ADMIN
        };
      }
      return {
        id: 'user-' + Math.random(),
        name: 'John Doe',
        email,
        role: UserRole.CUSTOMER
      };
    }
  },

  analytics: {
      getDashboardData: async (): Promise<AnalyticsData> => {
          await delay(600);
          const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]') as Order[];
          const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]') as Product[];

          const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
          const totalOrders = orders.length;
          const lowStockCount = products.filter(p => p.stock < 10).length;

          // Mock Chart Data
          const revenueData = [
              { name: 'Mon', value: 4000 },
              { name: 'Tue', value: 3000 },
              { name: 'Wed', value: 2000 },
              { name: 'Thu', value: 2780 },
              { name: 'Fri', value: 1890 },
              { name: 'Sat', value: 2390 },
              { name: 'Sun', value: 3490 },
          ];

          const categoryData = [
            { name: 'Diagnostic', value: 400 },
            { name: 'Mobility', value: 300 },
            { name: 'Hospital', value: 300 },
            { name: 'First Aid', value: 200 },
          ];

          return {
              totalSales,
              totalOrders,
              totalCustomers: 142, // Mock
              lowStockCount,
              recentOrders: orders.slice(0, 5),
              revenueData,
              categoryData
          };
      }
  }
};