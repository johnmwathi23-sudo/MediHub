export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
  STAFF = 'STAFF'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  stock: number;
  image: string; // Primary Image
  images?: string[]; // Gallery Images
  shortDescription: string;
  longDescription: string;
  specifications: Record<string, string>;
  rating: number;
  reviews: number;
  featured?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export enum OrderStatus {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled'
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  date: string;
}

export interface AnalyticsData {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  lowStockCount: number;
  recentOrders: Order[];
  revenueData: { name: string; value: number }[];
  categoryData: { name: string; value: number }[];
}