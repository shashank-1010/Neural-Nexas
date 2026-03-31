import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";

interface CartItem { medicineName: string; quantity: number; price: number; }

export default function MedicalStore() {
  const qc = useQueryClient();
  const { data: stores = [], isLoading } = useQuery({ queryKey: ["stores"], queryFn: api.getStores });
  const pharmacies = stores.filter((s: any) => s.type === "pharmacy");
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [newItem, setNewItem] = useState({ medicineName: "", quantity: 1, price: 0 });
  const [address, setAddress] = useState("");
  const [success, setSuccess] = useState(false);

  const order = useMutation({
    mutationFn: () => api.createOrder({ storeId: selectedStore.id, items: cart, deliveryAddress: address }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["orders"] }); setSuccess(true); setCart([]); },
  });

  const addToCart = () => {
    if (!newItem.medicineName || newItem.price <= 0) return;
    setCart(c => [...c, { ...newItem }]);
    setNewItem({ medicineName: "", quantity: 1, price: 0 });
  };

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  if (isLoading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;

  if (success) return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <ShoppingCart size={28} className="text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h2>
      <p className="text-gray-500 mb-6">Your medicine order has been placed successfully.</p>
      <button onClick={() => { setSuccess(false); setSelectedStore(null); }} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Order Again</button>
    </div>
  );

  if (!selectedStore) return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Medical Store</h1>
      <p className="text-gray-500 mb-6">Select a pharmacy to order medicines.</p>
      <div className="grid md:grid-cols-2 gap-4">
        {pharmacies.map((s: any) => (
          <div key={s.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 cursor-pointer hover:border-blue-400 transition-colors" onClick={() => setSelectedStore(s)}>
            <div className="flex justify-between items-start mb-2">
              <p className="font-semibold text-gray-900">{s.name}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${s.isOpen ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{s.isOpen ? "Open" : "Closed"}</span>
            </div>
            <p className="text-sm text-gray-500">{s.address}</p>
            <p className="text-sm text-gray-500">Rating: {s.rating} • {s.distance}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => setSelectedStore(null)} className="text-sm text-blue-600 hover:underline mb-4">&larr; Back to stores</button>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Order from {selectedStore.name}</h1>
      <p className="text-gray-500 mb-6">{selectedStore.address}</p>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-4">
        <h2 className="font-semibold mb-3">Add Medicines</h2>
        <div className="grid grid-cols-3 gap-2 mb-2">
          <input type="text" placeholder="Medicine name" value={newItem.medicineName} onChange={e => setNewItem({ ...newItem, medicineName: e.target.value })}
            className="col-span-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="number" placeholder="Qty" min={1} value={newItem.quantity} onChange={e => setNewItem({ ...newItem, quantity: +e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="number" placeholder="Price (₹)" min={0} value={newItem.price || ""} onChange={e => setNewItem({ ...newItem, price: +e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button onClick={addToCart} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">Add to Cart</button>
      </div>

      {cart.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-4">
          <h2 className="font-semibold mb-3">Cart ({cart.length} items)</h2>
          {cart.map((item, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b last:border-0">
              <div><p className="text-sm font-medium">{item.medicineName}</p><p className="text-xs text-gray-400">Qty: {item.quantity} × ₹{item.price}</p></div>
              <div className="flex items-center gap-3">
                <span className="font-medium text-sm">₹{item.price * item.quantity}</span>
                <button onClick={() => setCart(c => c.filter((_, j) => j !== i))}><Trash2 size={16} className="text-red-400 hover:text-red-600" /></button>
              </div>
            </div>
          ))}
          <div className="mt-3 flex justify-between font-semibold"><span>Total</span><span>₹{total}</span></div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="font-semibold mb-3">Delivery Address</h2>
        <textarea rows={2} value={address} onChange={e => setAddress(e.target.value)} placeholder="Enter your delivery address"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3" />
        <button onClick={() => order.mutate()} disabled={order.isPending || cart.length === 0 || !address}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60">
          {order.isPending ? "Placing Order..." : `Place Order — ₹${total}`}
        </button>
      </div>
    </div>
  );
}
