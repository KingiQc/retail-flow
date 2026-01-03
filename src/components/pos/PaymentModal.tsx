import React, { useState } from 'react';
import { X, Banknote, CreditCard, Building2, Check } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Payment, PaymentMethod, Sale } from '@/types/pos';
import { formatCurrency } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface PaymentModalProps {
  onClose: () => void;
  onComplete: (sale: Sale) => void;
}

const paymentMethods: { method: PaymentMethod; label: string; icon: React.ElementType }[] = [
  { method: 'cash', label: 'Cash', icon: Banknote },
  { method: 'transfer', label: 'Bank Transfer', icon: Building2 },
  { method: 'pos', label: 'POS Terminal', icon: CreditCard },
];

const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, onComplete }) => {
  const { total, checkout } = useCart();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('cash');
  const [amountPaid, setAmountPaid] = useState<string>(total.toString());
  const [reference, setReference] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const numericAmount = parseFloat(amountPaid) || 0;
  const change = numericAmount - total;
  const canComplete = numericAmount >= total;

  const handleNumpadClick = (value: string) => {
    if (value === 'C') {
      setAmountPaid('0');
    } else if (value === '⌫') {
      setAmountPaid(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    } else if (value === 'EXACT') {
      setAmountPaid(total.toString());
    } else {
      setAmountPaid(prev => prev === '0' ? value : prev + value);
    }
  };

  const handleComplete = async () => {
    if (!canComplete) return;

    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const payments: Payment[] = [{
      method: selectedMethod,
      amount: numericAmount,
      reference: reference || undefined,
    }];

    const sale = checkout(payments);
    
    if (sale) {
      onComplete(sale);
    }
    
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-card rounded-2xl shadow-strong w-full max-w-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Complete Payment</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Left - Payment Method & Amount */}
          <div className="space-y-6">
            {/* Payment Methods */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">PAYMENT METHOD</h3>
              <div className="grid grid-cols-3 gap-2">
                {paymentMethods.map(({ method, label, icon: Icon }) => (
                  <button
                    key={method}
                    onClick={() => setSelectedMethod(method)}
                    className={cn(
                      'p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all',
                      selectedMethod === method
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Reference for non-cash */}
            {selectedMethod !== 'cash' && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">REFERENCE</h3>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Transaction reference..."
                  className="w-full h-12 px-4 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            )}

            {/* Summary */}
            <div className="bg-muted/50 rounded-xl p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Due</span>
                <span className="text-xl font-bold text-foreground mono">{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Received</span>
                <span className="text-xl font-bold text-primary mono">{formatCurrency(numericAmount)}</span>
              </div>
              {selectedMethod === 'cash' && change > 0 && (
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="text-muted-foreground">Change Due</span>
                  <span className="text-xl font-bold text-success mono">{formatCurrency(change)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right - Numpad */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">ENTER AMOUNT</h3>
            
            {/* Amount Display */}
            <div className="bg-muted/50 rounded-xl p-4 mb-4">
              <p className="text-3xl font-bold text-center mono">
                {formatCurrency(numericAmount)}
              </p>
            </div>

            {/* Numpad */}
            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((key) => (
                <button
                  key={key}
                  onClick={() => handleNumpadClick(key)}
                  className={cn(
                    'pos-numpad-btn',
                    key === 'C' && 'bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground',
                    key === '⌫' && 'bg-accent/10 text-accent hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  {key}
                </button>
              ))}
            </div>

            {/* Quick Actions */}
            <button
              onClick={() => handleNumpadClick('EXACT')}
              className="w-full mt-2 h-12 rounded-xl bg-primary/10 text-primary font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Exact Amount
            </button>
          </div>
        </div>

        {/* Complete Button */}
        <div className="p-6 border-t border-border">
          <button
            onClick={handleComplete}
            disabled={!canComplete || isProcessing}
            className="pos-btn-success w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                Complete Sale
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
