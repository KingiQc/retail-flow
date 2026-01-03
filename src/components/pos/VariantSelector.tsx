import React, { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { Product } from '@/types/pos';
import { formatCurrency } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface VariantSelectorProps {
  product: Product;
  onConfirm: (size: string, color: string) => void;
  onClose: () => void;
}

const VariantSelector: React.FC<VariantSelectorProps> = ({ product, onConfirm, onClose }) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const sizes = useMemo(() => {
    const sizeSet = new Set(product.variants.map(v => v.size));
    return Array.from(sizeSet);
  }, [product.variants]);

  const colors = useMemo(() => {
    const colorSet = new Set(product.variants.map(v => v.color));
    return Array.from(colorSet);
  }, [product.variants]);

  const selectedVariant = useMemo(() => {
    if (!selectedSize || !selectedColor) return null;
    return product.variants.find(v => v.size === selectedSize && v.color === selectedColor);
  }, [product.variants, selectedSize, selectedColor]);

  const getStockForSize = (size: string) => {
    return product.variants
      .filter(v => v.size === size)
      .reduce((sum, v) => sum + v.stock, 0);
  };

  const getStockForColor = (color: string) => {
    if (!selectedSize) {
      return product.variants
        .filter(v => v.color === color)
        .reduce((sum, v) => sum + v.stock, 0);
    }
    const variant = product.variants.find(v => v.size === selectedSize && v.color === color);
    return variant?.stock || 0;
  };

  const handleConfirm = () => {
    if (selectedSize && selectedColor && selectedVariant && selectedVariant.stock > 0) {
      onConfirm(selectedSize, selectedColor);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-card rounded-2xl shadow-strong w-full max-w-md animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-foreground">{product.name}</h2>
            <p className="text-lg font-semibold text-primary mono mt-1">
              {formatCurrency(product.price)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Size Selection */}
        <div className="p-6 border-b border-border">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">SELECT SIZE</h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const stock = getStockForSize(size);
              const isOutOfStock = stock === 0;
              
              return (
                <button
                  key={size}
                  onClick={() => !isOutOfStock && setSelectedSize(size)}
                  disabled={isOutOfStock}
                  className={cn(
                    'pos-variant-badge min-w-[60px]',
                    selectedSize === size 
                      ? 'pos-variant-badge-active' 
                      : 'pos-variant-badge-inactive',
                    isOutOfStock && 'opacity-40 cursor-not-allowed line-through'
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Color Selection */}
        <div className="p-6 border-b border-border">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">SELECT COLOR</h3>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const stock = getStockForColor(color);
              const isOutOfStock = stock === 0;
              
              return (
                <button
                  key={color}
                  onClick={() => !isOutOfStock && setSelectedColor(color)}
                  disabled={isOutOfStock}
                  className={cn(
                    'pos-variant-badge',
                    selectedColor === color 
                      ? 'pos-variant-badge-active' 
                      : 'pos-variant-badge-inactive',
                    isOutOfStock && 'opacity-40 cursor-not-allowed line-through'
                  )}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stock Info */}
        <div className="p-6 border-b border-border bg-muted/30">
          {selectedVariant ? (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Available Stock</span>
              <span className={cn(
                'font-semibold',
                selectedVariant.stock > 5 ? 'text-success' : 
                selectedVariant.stock > 0 ? 'text-accent' : 'text-destructive'
              )}>
                {selectedVariant.stock} units
              </span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center">
              Select size and color to see availability
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="p-6">
          <button
            onClick={handleConfirm}
            disabled={!selectedSize || !selectedColor || !selectedVariant || selectedVariant.stock === 0}
            className="pos-btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default VariantSelector;
