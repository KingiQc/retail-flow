import React, { useState, useMemo } from 'react';
import { Search, AlertTriangle, Package, TrendingDown } from 'lucide-react';
import { mockProducts, mockCategories, formatCurrency } from '@/data/mockData';

const Inventory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');

  const inventoryData = useMemo(() => {
    const data: Array<{
      productId: string;
      productName: string;
      category: string;
      categoryColor: string;
      size: string;
      color: string;
      sku: string;
      stock: number;
      price: number;
    }> = [];

    mockProducts.forEach(product => {
      const category = mockCategories.find(c => c.id === product.categoryId);
      product.variants.forEach(variant => {
        data.push({
          productId: product.id,
          productName: product.name,
          category: category?.name || 'Unknown',
          categoryColor: category?.color || '#888',
          size: variant.size,
          color: variant.color,
          sku: variant.sku,
          stock: variant.stock,
          price: product.price,
        });
      });
    });

    return data;
  }, []);

  const filteredInventory = useMemo(() => {
    return inventoryData.filter(item => {
      const matchesSearch = 
        item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = 
        filter === 'all' ||
        (filter === 'low' && item.stock > 0 && item.stock <= 10) ||
        (filter === 'out' && item.stock === 0);

      return matchesSearch && matchesFilter;
    });
  }, [inventoryData, searchQuery, filter]);

  const stats = useMemo(() => {
    const totalItems = inventoryData.reduce((sum, item) => sum + item.stock, 0);
    const lowStock = inventoryData.filter(item => item.stock > 0 && item.stock <= 10).length;
    const outOfStock = inventoryData.filter(item => item.stock === 0).length;
    const totalValue = inventoryData.reduce((sum, item) => sum + (item.stock * item.price), 0);
    
    return { totalItems, lowStock, outOfStock, totalValue };
  }, [inventoryData]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Inventory Management</h1>
        <p className="text-muted-foreground">Track stock levels by size and color</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stats-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Units</p>
              <p className="text-2xl font-bold text-foreground mono">{stats.totalItems}</p>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Low Stock</p>
              <p className="text-2xl font-bold text-accent mono">{stats.lowStock}</p>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Out of Stock</p>
              <p className="text-2xl font-bold text-destructive mono">{stats.outOfStock}</p>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <span className="text-xl">₦</span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Inventory Value</p>
              <p className="text-xl font-bold text-foreground mono">{formatCurrency(stats.totalValue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'All Items' },
            { value: 'low', label: 'Low Stock' },
            { value: 'out', label: 'Out of Stock' },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value as typeof filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                filter === value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="pos-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Size</th>
                <th>Color</th>
                <th>SKU</th>
                <th>Stock</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item, index) => (
                <tr key={`${item.productId}-${item.sku}-${index}`}>
                  <td className="font-medium text-foreground">{item.productName}</td>
                  <td>
                    <span 
                      className="px-2 py-1 rounded text-xs font-medium"
                      style={{ 
                        backgroundColor: item.categoryColor + '20',
                        color: item.categoryColor 
                      }}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td>{item.size}</td>
                  <td>{item.color}</td>
                  <td className="font-mono text-sm text-muted-foreground">{item.sku}</td>
                  <td>
                    <span className={`font-semibold ${
                      item.stock === 0 ? 'text-destructive' :
                      item.stock <= 10 ? 'text-accent' : 'text-success'
                    }`}>
                      {item.stock}
                    </span>
                  </td>
                  <td className="mono">{formatCurrency(item.stock * item.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInventory.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Package className="w-12 h-12 mb-3 opacity-50" />
            <p>No inventory items found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
