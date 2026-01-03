export type UserRole = 'admin' | 'cashier';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface ProductVariant {
  size: string;
  color: string;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  barcode: string;
  categoryId: string;
  price: number;
  costPrice: number;
  variants: ProductVariant[];
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  unitPrice: number;
  discount: number;
}

export type PaymentMethod = 'cash' | 'transfer' | 'pos';

export interface Payment {
  method: PaymentMethod;
  amount: number;
  reference?: string;
}

export interface Sale {
  id: string;
  receiptNumber: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  payments: Payment[];
  cashierId: string;
  cashierName: string;
  createdAt: Date;
  status: 'completed' | 'refunded' | 'void';
}

export interface DailySummary {
  date: string;
  totalSales: number;
  transactionCount: number;
  averageTransaction: number;
  paymentBreakdown: {
    cash: number;
    transfer: number;
    pos: number;
  };
}
