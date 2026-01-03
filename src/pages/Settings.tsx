import React, { useState } from 'react';
import { Store, Printer, Receipt, Bell, Shield, Database } from 'lucide-react';

const Settings: React.FC = () => {
  const [storeName, setStoreName] = useState('StylePOS');
  const [storeAddress, setStoreAddress] = useState('123 Fashion Street, Lagos');
  const [storePhone, setStorePhone] = useState('+234 800 123 4567');
  const [taxEnabled, setTaxEnabled] = useState(false);
  const [taxRate, setTaxRate] = useState('7.5');
  const [receiptFooter, setReceiptFooter] = useState('Thank you for shopping with us!');

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('pos_settings', JSON.stringify({
      storeName,
      storeAddress,
      storePhone,
      taxEnabled,
      taxRate,
      receiptFooter,
    }));
    alert('Settings saved successfully!');
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Configure your POS system</p>
      </div>

      {/* Store Information */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Store className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Store Information</h2>
            <p className="text-sm text-muted-foreground">Details shown on receipts</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Store Name
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Address
            </label>
            <input
              type="text"
              value={storeAddress}
              onChange={(e) => setStoreAddress(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Phone Number
            </label>
            <input
              type="text"
              value={storePhone}
              onChange={(e) => setStorePhone(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Tax Settings */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Receipt className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Tax Settings</h2>
            <p className="text-sm text-muted-foreground">Configure tax calculations</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Enable Tax</p>
              <p className="text-sm text-muted-foreground">Apply tax to all sales</p>
            </div>
            <button
              onClick={() => setTaxEnabled(!taxEnabled)}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                taxEnabled ? 'bg-primary' : 'bg-secondary'
              }`}
            >
              <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-transform ${
                taxEnabled ? 'left-7' : 'left-1'
              }`} />
            </button>
          </div>

          {taxEnabled && (
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Tax Rate (%)
              </label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-mono"
                step="0.1"
                min="0"
                max="100"
              />
            </div>
          )}
        </div>
      </div>

      {/* Receipt Settings */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
            <Printer className="w-5 h-5 text-success" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Receipt Settings</h2>
            <p className="text-sm text-muted-foreground">Customize receipt appearance</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Receipt Footer Message
            </label>
            <textarea
              value={receiptFooter}
              onChange={(e) => setReceiptFooter(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
            />
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <Database className="w-5 h-5 text-secondary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">System Information</h2>
            <p className="text-sm text-muted-foreground">POS system details</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-muted-foreground">Version</p>
            <p className="font-medium text-foreground">1.0.0</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-muted-foreground">Storage</p>
            <p className="font-medium text-foreground">Local Browser</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-muted-foreground">Last Backup</p>
            <p className="font-medium text-foreground">Today</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-muted-foreground">Status</p>
            <p className="font-medium text-success">Online</p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button onClick={handleSave} className="pos-btn-primary">
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;
