import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";

export type CartItem = {
  id: number;
  type: "test" | "package";
  name: string;
  price: number;
};

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number, type: "test" | "package") => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === item.id && i.type === item.type);
      if (exists) {
        toast({
          title: "Already in cart",
          description: `${item.name} is already in your cart.`,
          variant: "default",
        });
        return prev;
      }
      toast({
        title: "Added to cart",
        description: `${item.name} has been added.`,
        className: "bg-green-50 border-green-200 text-green-900",
      });
      return [...prev, item];
    });
  }, [toast]);

  const removeItem = useCallback((id: number, type: "test" | "package") => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.type === type)));
    toast({
      title: "Removed",
      description: "Item removed from cart.",
    });
  }, [toast]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const total = useMemo(() => items.reduce((sum, item) => sum + item.price, 0), [items]);
  const itemCount = items.length;

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
