import React, { useState, useMemo } from 'react';
import { Download, Calendar, Filter, TrendingUp, DollarSign, ShoppingBag } from 'lucide-react';
import { mockSales, formatCurrency } from '@/data/mockData';

const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('all');

  const filteredSales = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    return mockSales.filter(sale => {
      switch (dateRange) {
        case 'today':
          return sale.createdAt >= today;
        case 'week':
          return sale.createdAt >= weekAgo;
        case 'month':
          return sale.createdAt >= monthAgo;
        default:
          return true;
      }
    });
  }, [dateRange]);

  const stats = useMemo(() => {
    const totalRevenue = filteredSales.reduce((sum, s) => sum + s.total, 0);
    const totalTransactions = filteredSales.length;
    const averageOrder = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
    
    const paymentBreakdown = {
      cash: filteredSales.filter(s => s.payments[0]?.method === 'cash').reduce((sum, s) => sum + s.total, 0),
      transfer: filteredSales.filter(s => s.payments[0]?.method === 'transfer').reduce((sum, s) => sum + s.total, 0),
      pos: filteredSales.filter(s => s.payments[0]?.method === 'pos').reduce((sum, s) => sum + s.total, 0),
    };

    return { totalRevenue, totalTransactions, averageOrder, paymentBreakdown };
  }, [filteredSales]);

  const handleExportCSV = () => {
    const headers = ['Receipt', 'Date', 'Time', 'Cashier', 'Items', 'Subtotal', 'Discount', 'Total', 'Payment'];
    const rows = filteredSales.map(sale => [
      sale.receiptNumber,
      sale.createdAt.toLocaleDateString(),
      sale.createdAt.toLocaleTimeString(),
      sale.cashierName,
      sale.items.length.toString(),
      sale.subtotal.toString(),
      sale.discount.toString(),
      sale.total.toString(),
      sale.payments[0]?.method || '',
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const paymentMethodLabels = {
    cash: 'Cash',
    transfer: 'Bank Transfer',
    pos: 'POS Terminal',
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sales Reports</h1>
          <p className="text-muted-foreground">View and export your sales data</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="pos-btn-primary flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      {/* Date Filter */}
      <div className="flex gap-2">
        {[
          { value: 'today', label: 'Today' },
          { value: 'week', label: 'This Week' },
          { value: 'month', label: 'This Month' },
          { value: 'all', label: 'All Time' },
        ].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setDateRange(value as typeof dateRange)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              dateRange === value
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stats-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold text-foreground mono">{formatCurrency(stats.totalRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Transactions</p>
              <p className="text-2xl font-bold text-foreground mono">{stats.totalTransactions}</p>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Order</p>
              <p className="text-2xl font-bold text-foreground mono">{formatCurrency(stats.averageOrder)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(stats.paymentBreakdown).map(([method, amount]) => (
          <div key={method} className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground capitalize">
                  {paymentMethodLabels[method as keyof typeof paymentMethodLabels]}
                </p>
                <p className="text-xl font-bold text-foreground mono">{formatCurrency(amount)}</p>
              </div>
              <div className="text-2xl">
                {method === 'cash' ? '💵' : method === 'transfer' ? '🏦' : '💳'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sales Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="pos-table">
            <thead>
              <tr>
                <th>Receipt</th>
                <th>Date</th>
                <th>Time</th>
                <th>Cashier</th>
                <th>Items</th>
                <th>Subtotal</th>
                <th>Discount</th>
                <th>Total</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale.id}>
                  <td className="font-mono text-sm">{sale.receiptNumber}</td>
                  <td>{sale.createdAt.toLocaleDateString()}</td>
                  <td>{sale.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td>{sale.cashierName}</td>
                  <td>{sale.items.length}</td>
                  <td className="mono">{formatCurrency(sale.subtotal)}</td>
                  <td className={sale.discount > 0 ? 'text-success mono' : 'mono'}>
                    {sale.discount > 0 ? `-${formatCurrency(sale.discount)}` : '-'}
                  </td>
                  <td className="font-semibold mono">{formatCurrency(sale.total)}</td>
                  <td>
                    <span className="px-2 py-1 rounded-lg text-xs font-medium bg-secondary text-secondary-foreground capitalize">
                      {sale.payments[0]?.method}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSales.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <ShoppingBag className="w-12 h-12 mb-3 opacity-50" />
            <p>No sales found for this period</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
