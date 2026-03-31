import { useState } from "react";
import { useGetStores, useCreateOrder } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Store, ShoppingBag, Plus, Minus, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function MedicalStore() {
  const { data: stores, isLoading } = useGetStores();
  const pharmacies = stores?.filter(s => s.type === "pharmacy") || [];
  const { toast } = useToast();
  const createOrder = useCreateOrder();
  
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [cart, setCart] = useState<{name: string, price: number, qty: number}[]>([]);
  const [address, setAddress] = useState("");
  const [medicineInput, setMedicineInput] = useState("");

  const addToCart = () => {
    if (!medicineInput.trim()) return;
    // Mock price for demo
    const price = Math.floor(Math.random() * 30) + 5;
    setCart([...cart, { name: medicineInput, price, qty: 1 }]);
    setMedicineInput("");
  };

  const updateQty = (index: number, delta: number) => {
    const newCart = [...cart];
    newCart[index].qty += delta;
    if (newCart[index].qty <= 0) {
      newCart.splice(index, 1);
    }
    setCart(newCart);
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleCheckout = () => {
    if (!address) {
      toast({ variant: "destructive", title: "Address required" });
      return;
    }
    if (cart.length === 0) {
      toast({ variant: "destructive", title: "Cart is empty" });
      return;
    }

    const items = cart.map(c => ({ medicineName: c.name, quantity: c.qty, price: c.price }));
    
    createOrder.mutate(
      { data: { storeId: selectedStore.id, items, deliveryAddress: address } },
      {
        onSuccess: () => {
          toast({ title: "Order placed successfully", description: "Your medicines will be delivered soon." });
          setSelectedStore(null);
          setCart([]);
          setAddress("");
        },
        onError: () => toast({ variant: "destructive", title: "Failed to place order" })
      }
    );
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Medical Store</h1>
        <p className="text-gray-600">Order medicines from verified local pharmacies</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pharmacies.map((store) => (
            <Card key={store.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4 text-blue-600">
                  <Store className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg">{store.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{store.address}</p>
                <div className="flex justify-between items-center mt-4">
                  {store.isOpen ? (
                    <Badge className="bg-green-100 text-green-800 border-0">Open Now</Badge>
                  ) : (
                    <Badge variant="outline">Closed</Badge>
                  )}
                  <Button 
                    variant="outline" 
                    disabled={!store.isOpen}
                    onClick={() => setSelectedStore(store)}
                  >
                    Order from here
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedStore} onOpenChange={(open) => !open && setSelectedStore(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Order from {selectedStore?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="flex gap-2">
              <Input 
                placeholder="Enter medicine name..." 
                value={medicineInput}
                onChange={(e) => setMedicineInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addToCart()}
              />
              <Button onClick={addToCart}>Add</Button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 min-h-[150px]">
              {cart.length === 0 ? (
                <div className="text-center text-gray-500 py-8">Your cart is empty</div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white p-2 rounded border shadow-sm">
                      <div>
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-gray-500">${item.price} each</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => updateQty(idx, -1)} className="p-1 rounded-full hover:bg-gray-100 text-gray-600"><Minus className="h-3 w-3" /></button>
                        <span className="text-sm font-medium w-4 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(idx, 1)} className="p-1 rounded-full hover:bg-gray-100 text-gray-600"><Plus className="h-3 w-3" /></button>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-3 border-t font-bold mt-2">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Delivery Address</label>
              <Input 
                placeholder="Enter full delivery address" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <Button 
              className="w-full" 
              size="lg"
              disabled={cart.length === 0 || !address || createOrder.isPending}
              onClick={handleCheckout}
            >
              {createOrder.isPending ? "Processing..." : "Place Order"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
