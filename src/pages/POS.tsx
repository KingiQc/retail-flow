import React, { useState } from 'react';
import { Product, Sale } from '@/types/pos';
import { useCart } from '@/contexts/CartContext';
import ProductGrid from '@/components/pos/ProductGrid';
import VariantSelector from '@/components/pos/VariantSelector';
import Cart from '@/components/pos/Cart';
import PaymentModal from '@/components/pos/PaymentModal';
import ReceiptModal from '@/components/pos/ReceiptModal';

const POS: React.FC = () => {
  const { addItem } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleVariantConfirm = (size: string, color: string) => {
    if (selectedProduct) {
      addItem(selectedProduct, size, color);
      setSelectedProduct(null);
    }
  };

  const handleCheckout = () => {
    setShowPayment(true);
  };

  const handlePaymentComplete = (sale: Sale) => {
    setShowPayment(false);
    setCompletedSale(sale);
  };

  const handleNewSale = () => {
    setCompletedSale(null);
  };

  return (
    <div className="h-screen flex">
      {/* Product Grid - Left Side */}
      <div className="flex-1 flex flex-col bg-background">
        <ProductGrid onSelectProduct={handleProductSelect} />
      </div>

      {/* Cart - Right Side */}
      <div className="w-96 xl:w-[420px] border-l border-border">
        <Cart onCheckout={handleCheckout} />
      </div>

      {/* Modals */}
      {selectedProduct && (
        <VariantSelector
          product={selectedProduct}
          onConfirm={handleVariantConfirm}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {showPayment && (
        <PaymentModal
          onClose={() => setShowPayment(false)}
          onComplete={handlePaymentComplete}
        />
      )}

      {completedSale && (
        <ReceiptModal
          sale={completedSale}
          onClose={() => setCompletedSale(null)}
          onNewSale={handleNewSale}
        />
      )}
    </div>
  );
};

export default POS;
