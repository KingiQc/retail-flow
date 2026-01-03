import React, { useMemo } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Package
} from 'lucide-react';
import { mockSales, mockProducts, formatCurrency } from '@/data/mockData';

const Dashboard: React.FC = () => {
  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const todaySales = mockSales.filter(s => s.createdAt.toDateString() === today);
    const totalRevenue = mockSales.reduce((sum, s) => sum + s.total, 0);
    const todayRevenue = todaySales.reduce((sum, s) => sum + s.total, 0);
    const totalItems = mockProducts.reduce((sum, p) => 
      sum + p.variants.reduce((vs, v) => vs + v.stock, 0), 0
    );

    return {
      totalRevenue,
      todayRevenue,
      totalTransactions: mockSales.length,
      todayTransactions: todaySales.length,
      averageOrder: totalRevenue / mockSales.length || 0,
      totalItems,
    };
  }, []);

  const recentSales = mockSales.slice(-5).reverse();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your store overview.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Today</p>
          <p className="font-semibold text-foreground">
            {new Date().toLocaleDateString('en-NG', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stats-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold text-foreground mt-1 mono">
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-sm text-success">
            <ArrowUpRight className="w-4 h-4" />
            <span>+12.5% from last month</span>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Today's Sales</p>
              <p className="text-2xl font-bold text-foreground mt-1 mono">
                {formatCurrency(stats.todayRevenue)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-sm text-muted-foreground">
            <span>{stats.todayTransactions} transactions</span>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Average Order</p>
              <p className="text-2xl font-bold text-foreground mt-1 mono">
                {formatCurrency(stats.averageOrder)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-accent" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-sm text-success">
            <ArrowUpRight className="w-4 h-4" />
            <span>+5.2% from last week</span>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Items in Stock</p>
              <p className="text-2xl font-bold text-foreground mt-1 mono">
                {stats.totalItems}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
              <Package className="w-6 h-6 text-secondary-foreground" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-sm text-destructive">
            <ArrowDownRight className="w-4 h-4" />
            <span>3 items low stock</span>
          </div>
        </div>
      </div>

      {/* Recent Sales & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Sales */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground">Recent Sales</h2>
            <a href="/reports" className="text-sm text-primary hover:underline">
              View all
            </a>
          </div>
          
          <div className="overflow-x-auto">
            <table className="pos-table">
              <thead>
                <tr>
                  <th>Receipt</th>
                  <th>Cashier</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {recentSales.map((sale) => (
                  <tr key={sale.id}>
                    <td className="font-mono text-sm">{sale.receiptNumber}</td>
                    <td>{sale.cashierName}</td>
                    <td>{sale.items.length}</td>
                    <td className="font-semibold mono">{formatCurrency(sale.total)}</td>
                    <td className="text-muted-foreground">
                      {sale.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-bold text-foreground mb-6">Top Products</h2>
          
          <div className="space-y-4">
            {mockProducts.slice(0, 5).map((product, index) => (
              <div key={product.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {product.variants.reduce((s, v) => s + v.stock, 0)} in stock
                  </p>
                </div>
                <p className="font-semibold text-primary mono">
                  {formatCurrency(product.price)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
