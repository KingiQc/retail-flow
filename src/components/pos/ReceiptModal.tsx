import React, { useRef } from 'react';
import { X, Printer, Check } from 'lucide-react';
import { Sale } from '@/types/pos';
import { formatCurrency } from '@/data/mockData';

interface ReceiptModalProps {
  sale: Sale;
  onClose: () => void;
  onNewSale: () => void;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ sale, onClose, onNewSale }) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (receiptRef.current) {
      const printWindow = window.open('', '', 'width=300,height=600');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Receipt - ${sale.receiptNumber}</title>
              <style>
                body {
                  font-family: 'Courier New', monospace;
                  font-size: 12px;
                  width: 280px;
                  margin: 0 auto;
                  padding: 10px;
                }
                .header { text-align: center; margin-bottom: 10px; }
                .divider { border-top: 1px dashed #000; margin: 8px 0; }
                .item { display: flex; justify-content: space-between; margin: 4px 0; }
                .total { font-weight: bold; font-size: 14px; }
                .footer { text-align: center; margin-top: 15px; font-size: 11px; }
              </style>
            </head>
            <body>
              ${receiptRef.current.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
      }
    }
  };

  const paymentMethodLabels = {
    cash: 'Cash',
    transfer: 'Bank Transfer',
    pos: 'POS Terminal',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-card rounded-2xl shadow-strong w-full max-w-md animate-scale-in">
        {/* Success Header */}
        <div className="p-6 text-center border-b border-border">
          <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Sale Complete!</h2>
          <p className="text-muted-foreground">Receipt #{sale.receiptNumber}</p>
        </div>

        {/* Receipt Preview */}
        <div className="p-6 max-h-80 overflow-y-auto">
          <div ref={receiptRef} className="bg-white p-4 rounded-lg text-sm font-mono text-gray-800">
            <div className="text-center mb-4">
              <h3 className="font-bold text-lg">StylePOS</h3>
              <p className="text-xs text-gray-600">Your Fashion Destination</p>
              <p className="text-xs text-gray-600">123 Fashion Street, Lagos</p>
              <p className="text-xs text-gray-600">Tel: +234 800 123 4567</p>
            </div>

            <div className="border-t border-dashed border-gray-400 my-3" />

            <div className="text-xs space-y-1">
              <p>Receipt: {sale.receiptNumber}</p>
              <p>Date: {sale.createdAt.toLocaleDateString()}</p>
              <p>Time: {sale.createdAt.toLocaleTimeString()}</p>
              <p>Cashier: {sale.cashierName}</p>
            </div>

            <div className="border-t border-dashed border-gray-400 my-3" />

            <div className="space-y-2">
              {sale.items.map((item, index) => (
                <div key={index}>
                  <p className="font-medium">{item.product.name}</p>
                  <div className="flex justify-between text-xs">
                    <span>{item.selectedSize} / {item.selectedColor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{item.quantity} x {formatCurrency(item.unitPrice)}</span>
                    <span>{formatCurrency(item.unitPrice * item.quantity)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-gray-400 my-3" />

            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(sale.subtotal)}</span>
              </div>
              {sale.discount > 0 && (
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span>-{formatCurrency(sale.discount)}</span>
                </div>
              )}
              {sale.tax > 0 && (
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatCurrency(sale.tax)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base border-t border-gray-400 pt-1">
                <span>TOTAL</span>
                <span>{formatCurrency(sale.total)}</span>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-400 my-3" />

            <div className="space-y-1">
              {sale.payments.map((payment, index) => (
                <div key={index} className="flex justify-between text-xs">
                  <span>{paymentMethodLabels[payment.method]}</span>
                  <span>{formatCurrency(payment.amount)}</span>
                </div>
              ))}
              {sale.payments[0]?.method === 'cash' && sale.payments[0].amount > sale.total && (
                <div className="flex justify-between font-medium">
                  <span>Change</span>
                  <span>{formatCurrency(sale.payments[0].amount - sale.total)}</span>
                </div>
              )}
            </div>

            <div className="text-center mt-4 text-xs">
              <p>Thank you for shopping with us!</p>
              <p className="text-gray-500 mt-1">Returns accepted within 7 days</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-border flex gap-3">
          <button
            onClick={handlePrint}
            className="pos-btn-secondary flex-1 flex items-center justify-center gap-2"
          >
            <Printer className="w-5 h-5" />
            Print Receipt
          </button>
          <button
            onClick={onNewSale}
            className="pos-btn-primary flex-1"
          >
            New Sale
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
