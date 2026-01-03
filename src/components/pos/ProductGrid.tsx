import React, { useState, useMemo } from 'react';
import { Search, ScanBarcode, Package } from 'lucide-react';
import { Product, Category } from '@/types/pos';
import { mockProducts, mockCategories, formatCurrency } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface ProductGridProps {
  onSelectProduct: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ onSelectProduct }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [barcodeInput, setBarcodeInput] = useState('');

  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.barcode.includes(searchQuery);
      const matchesCategory = !selectedCategory || product.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = mockProducts.find(p => p.barcode === barcodeInput);
    if (product) {
      onSelectProduct(product);
      setBarcodeInput('');
    }
  };

  const getTotalStock = (product: Product) => {
    return product.variants.reduce((sum, v) => sum + v.stock, 0);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search & Barcode */}
      <div className="p-4 space-y-3 bg-card border-b border-border">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
        
        <form onSubmit={handleBarcodeSubmit} className="relative">
          <ScanBarcode className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Scan barcode or enter code..."
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-mono"
          />
        </form>
      </div>

      {/* Categories */}
      <div className="p-4 bg-card border-b border-border">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
              !selectedCategory 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            All Items
          </button>
          {mockCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => {
            const totalStock = getTotalStock(product);
            const category = mockCategories.find(c => c.id === product.categoryId);
            
            return (
              <button
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="pos-product-card text-left group"
              >
                {/* Product Image Placeholder */}
                <div 
                  className="aspect-square rounded-lg mb-3 flex items-center justify-center text-4xl"
                  style={{ backgroundColor: category?.color + '20' }}
                >
                  👕
                </div>
                
                {/* Product Info */}
                <div className="space-y-1">
                  <span 
                    className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                    style={{ 
                      backgroundColor: category?.color + '20',
                      color: category?.color 
                    }}
                  >
                    {category?.name}
                  </span>
                  <h3 className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-lg font-bold text-primary mono">
                    {formatCurrency(product.price)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {totalStock} in stock
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <Package className="w-12 h-12 mb-3 opacity-50" />
            <p>No products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
