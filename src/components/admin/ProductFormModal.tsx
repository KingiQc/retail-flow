import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Product, ProductVariant } from '@/types/pos';
import { mockCategories } from '@/data/mockData';

interface ProductFormModalProps {
  product: Product | null;
  onSave: (product: Product) => void;
  onClose: () => void;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ product, onSave, onClose }) => {
  const [name, setName] = useState(product?.name || '');
  const [barcode, setBarcode] = useState(product?.barcode || '');
  const [categoryId, setCategoryId] = useState(product?.categoryId || mockCategories[0].id);
  const [price, setPrice] = useState(product?.price.toString() || '');
  const [costPrice, setCostPrice] = useState(product?.costPrice.toString() || '');
  const [variants, setVariants] = useState<ProductVariant[]>(
    product?.variants || [{ size: '', color: '', stock: 0, sku: '' }]
  );

  const handleAddVariant = () => {
    setVariants([...variants, { size: '', color: '', stock: 0, sku: '' }]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index: number, field: keyof ProductVariant, value: string | number) => {
    setVariants(variants.map((v, i) => 
      i === index ? { ...v, [field]: value } : v
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData: Product = {
      id: product?.id || '',
      name,
      barcode,
      categoryId,
      price: parseFloat(price) || 0,
      costPrice: parseFloat(costPrice) || 0,
      variants: variants.filter(v => v.size && v.color),
      createdAt: product?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    onSave(productData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-card rounded-2xl shadow-strong w-full max-w-2xl max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-160px)]">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter product name"
                className="w-full h-12 px-4 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Barcode
              </label>
              <input
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="Enter barcode"
                className="w-full h-12 px-4 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                required
              >
                {mockCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Selling Price (₦) *
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                className="w-full h-12 px-4 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-mono"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Cost Price (₦)
              </label>
              <input
                type="number"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                placeholder="0"
                className="w-full h-12 px-4 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-mono"
                min="0"
              />
            </div>
          </div>

          {/* Variants */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium text-muted-foreground">
                Product Variants (Size/Color)
              </label>
              <button
                type="button"
                onClick={handleAddVariant}
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <Plus className="w-4 h-4" />
                Add Variant
              </button>
            </div>

            <div className="space-y-3">
              {variants.map((variant, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-1 grid grid-cols-4 gap-2">
                    <input
                      type="text"
                      value={variant.size}
                      onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                      placeholder="Size"
                      className="h-10 px-3 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none transition-all text-sm"
                    />
                    <input
                      type="text"
                      value={variant.color}
                      onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                      placeholder="Color"
                      className="h-10 px-3 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none transition-all text-sm"
                    />
                    <input
                      type="number"
                      value={variant.stock}
                      onChange={(e) => handleVariantChange(index, 'stock', parseInt(e.target.value) || 0)}
                      placeholder="Stock"
                      className="h-10 px-3 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none transition-all text-sm font-mono"
                      min="0"
                    />
                    <input
                      type="text"
                      value={variant.sku}
                      onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                      placeholder="SKU"
                      className="h-10 px-3 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none transition-all text-sm font-mono"
                    />
                  </div>
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(index)}
                      className="w-10 h-10 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-border flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="pos-btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="pos-btn-primary flex-1"
          >
            {product ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFormModal;
