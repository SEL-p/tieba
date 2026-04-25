'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { data: session } = useSession();
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const refreshCart = async () => {
    if (!session) return;
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();
      if (Array.isArray(data)) {
        setCartCount(data.reduce((acc, item) => acc + item.quantity, 0));
        setCartTotal(data.reduce((acc, item) => acc + (item.product.price * item.quantity), 0));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const refreshWishlist = async () => {
    if (!session) return;
    try {
      const res = await fetch('/api/favorites');
      const data = await res.json();
      if (Array.isArray(data)) {
        setWishlistCount(data.length);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (session) {
      refreshCart();
      refreshWishlist();
    } else {
      setCartCount(0);
      setCartTotal(0);
      setWishlistCount(0);
    }
  }, [session]);

  return (
    <CartContext.Provider value={{ 
      cartCount, 
      cartTotal, 
      wishlistCount, 
      refreshCart, 
      refreshWishlist 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
