import { requireSupabase } from './supabase';
const supabase = requireSupabase();
import { Product, User, Order, UserRole, OrderStatus, AnalyticsData } from '../types';

export const api = {
  products: {
    getAll: async (): Promise<Product[]> => {
      const { data, error } = await supabase.from('products').select('*');
      if (error) throw error;
      return (data || []).map(mapProduct);
    },
    getById: async (id: string): Promise<Product | undefined> => {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (error) return undefined;
      return data ? mapProduct(data) : undefined;
    },
    create: async (product: Omit<Product, 'id'>): Promise<Product> => {
      const { data, error } = await supabase.from('products').insert({
        name: product.name,
        slug: product.slug,
        category: product.category,
        price: product.price,
        stock: product.stock,
        image: product.image,
        images: product.images || [product.image],
        short_description: product.shortDescription,
        long_description: product.longDescription,
        specifications: product.specifications,
        rating: product.rating,
        reviews: product.reviews,
        featured: product.featured || false,
      }).select().single();
      if (error) throw error;
      return mapProduct(data);
    },
    update: async (id: string, updates: Partial<Product>): Promise<Product> => {
      const dbUpdates: Record<string, unknown> = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.slug !== undefined) dbUpdates.slug = updates.slug;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.price !== undefined) dbUpdates.price = updates.price;
      if (updates.stock !== undefined) dbUpdates.stock = updates.stock;
      if (updates.image !== undefined) dbUpdates.image = updates.image;
      if (updates.images !== undefined) dbUpdates.images = updates.images;
      if (updates.shortDescription !== undefined) dbUpdates.short_description = updates.shortDescription;
      if (updates.longDescription !== undefined) dbUpdates.long_description = updates.longDescription;
      if (updates.specifications !== undefined) dbUpdates.specifications = updates.specifications;
      if (updates.rating !== undefined) dbUpdates.rating = updates.rating;
      if (updates.reviews !== undefined) dbUpdates.reviews = updates.reviews;
      if (updates.featured !== undefined) dbUpdates.featured = updates.featured;

      const { data, error } = await supabase.from('products').update(dbUpdates).eq('id', id).select().single();
      if (error) throw error;
      return mapProduct(data);
    },
    delete: async (id: string): Promise<void> => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    }
  },

  orders: {
    create: async (order: Omit<Order, 'id' | 'date' | 'status'>): Promise<Order> => {
      const { data: user } = await supabase.auth.getUser();
      const userId = user.user?.id;

      const { data: orderData, error: orderError } = await supabase.from('orders').insert({
        user_id: userId,
        customer_name: order.customerName,
        total: order.total,
        status: OrderStatus.PENDING,
      }).select().single();
      if (orderError) throw orderError;

      if (order.items.length > 0) {
        const items = order.items.map(item => ({
          order_id: orderData.id,
          product_id: item.id,
          product_name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        }));
        const { error: itemsError } = await supabase.from('order_items').insert(items);
        if (itemsError) throw itemsError;
      }

      return {
        id: orderData.id,
        userId: userId || '',
        customerName: order.customerName,
        items: order.items,
        total: order.total,
        status: OrderStatus.PENDING,
        date: orderData.created_at,
      };
    },
    getAll: async (): Promise<Order[]> => {
      const { data, error } = await supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(mapOrder);
    },
    updateStatus: async (id: string, status: OrderStatus): Promise<void> => {
      const { error } = await supabase.from('orders').update({ status }).eq('id', id);
      if (error) throw error;
    }
  },

  auth: {
    login: async (email: string, password: string): Promise<User> => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
      const user = data.user;
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
      return {
        id: user.id,
        name: profile?.name || user.email || '',
        email: user.email || '',
        role: (profile?.role as UserRole) || UserRole.CUSTOMER,
      };
    },
    signUp: async (email: string, password: string, name: string): Promise<User> => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) throw new Error(error.message);
      const user = data.user!;
      return {
        id: user.id,
        name,
        email: user.email || '',
        role: UserRole.CUSTOMER,
      };
    },
    getCurrentUser: async (): Promise<User | null> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
      return {
        id: user.id,
        name: profile?.name || user.email || '',
        email: user.email || '',
        role: (profile?.role as UserRole) || UserRole.CUSTOMER,
      };
    },
    signOut: async (): Promise<void> => {
      await supabase.auth.signOut();
    }
  },

  analytics: {
    getDashboardData: async (): Promise<AnalyticsData> => {
      const { data: orders, error: ordersError } = await supabase.from('orders').select('*');
      if (ordersError) throw ordersError;

      const { data: products, error: productsError } = await supabase.from('products').select('*');
      if (productsError) throw productsError;

      const { count: totalCustomers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

      const totalSales = (orders || []).reduce((sum, o) => sum + Number(o.total), 0);
      const totalOrders = (orders || []).length;
      const lowStockCount = (products || []).filter(p => p.stock < 10).length;

      const recentOrders = await api.orders.getAll();
      const recentOrdersSlice = (await recentOrders).slice(0, 5);

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
        totalCustomers: totalCustomers || 0,
        lowStockCount,
        recentOrders: recentOrdersSlice,
        revenueData,
        categoryData
      };
    }
  }
};

function mapProduct(data: Record<string, unknown>): Product {
  return {
    id: data.id as string,
    name: data.name as string,
    slug: data.slug as string,
    category: data.category as string,
    price: Number(data.price),
    stock: data.stock as number,
    image: (data.image as string) || '',
    images: (data.images as string[]) || [(data.image as string) || ''],
    shortDescription: (data.short_description as string) || '',
    longDescription: (data.long_description as string) || '',
    specifications: (data.specifications as Record<string, string>) || {},
    rating: Number(data.rating),
    reviews: data.reviews as number,
    featured: data.featured as boolean || false,
  };
}

function mapOrder(data: Record<string, unknown>): Order {
  const itemsData = data.order_items as Record<string, unknown>[] | undefined;
  return {
    id: data.id as string,
    userId: (data.user_id as string) || '',
    customerName: data.customer_name as string,
    items: (itemsData || []).map(item => ({
      id: item.product_id as string,
      name: item.product_name as string,
      price: Number(item.price),
      quantity: item.quantity as number,
      image: (item.image as string) || '',
      slug: '',
      category: '',
      stock: 0,
      shortDescription: '',
      longDescription: '',
      specifications: {},
      rating: 0,
      reviews: 0,
    })),
    total: Number(data.total),
    status: data.status as OrderStatus,
    date: data.created_at as string,
  };
}
