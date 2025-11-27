// 'use client';
// import {SessionProvider} from "next-auth/react";
// import {createContext, useState, useEffect} from "react";
// import toast from "react-hot-toast"
// export const CartContext = createContext({});

// export function cartProductPrice(cartProduct) {
//     let price = Number(cartProduct.basePrice);
//     if(cartProduct.size) {
//         price += Number(cartProduct.size.price);
//     }
//     if (cartProduct.extras?.length > 0) {
//         for (const extra of cartProduct.extras){
//         price += Number(extra.price);   
//         }
//     }
//     return price;
// }

// export default function AppProvider({children}) {
//     const [cartProducts, setCartProducts] = useState([]);

//     const ls = typeof window !== 'undefined' ? window.localStorage : null;

//     useEffect(() => {
//         if (ls && ls.getItem('cart')){
//             setCartProducts( JSON.parse( ls.getItem('cart')))
//         }
//     }, [])

    

//     function clearCart() {
//         setCartProducts([]);
//         saveCartProductsToLocalStorage([]);
//     }

//     function removeCartProduct(indexToRemove) {
//         setCartProducts(prevCartProducts => {
//             const newCartProducts = prevCartProducts
//                 .filter((v, index) => index !== indexToRemove);
//             saveCartProductsToLocalStorage(newCartProducts);
//             return newCartProducts;
//         });
//         toast.success('Product removed')
//     }

//     function saveCartProductsToLocalStorage(cartProducts) {
//         if(ls) {
//             ls.setItem('cart', JSON.stringify(cartProducts));
//         }
//     }

//     function addToCart(product, size=null, extras=[]) {
//         setCartProducts(prevProducts => {
//             const cartProduct = {...product, size, extras};
//             const newProducts = [...prevProducts, cartProduct];
//             saveCartProductsToLocalStorage(newProducts)
//             return newProducts;
//         });
//     }
//     return (
//         <SessionProvider>
//             <CartContext.Provider value={{
//                 cartProducts, setCartProducts,addToCart,
//                 removeCartProduct, clearCart                   
//             }}>
//                 {children}
//             </CartContext.Provider>
//         </SessionProvider>
//     );
// }

'use client';
import { SessionProvider, useSession } from "next-auth/react";
import { createContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useCallback } from "react";

export const CartContext = createContext({});

export function cartProductPrice(cartProduct) {
  let price = Number(cartProduct.basePrice);
  if (cartProduct.size) {
    price += Number(cartProduct.size.price);
  }
  if (cartProduct.extras?.length > 0) {
    for (const extra of cartProduct.extras) {
      price += Number(extra.price);
    }
  }
  return price;
}

// Provider chính quản lý giỏ hàng theo user
function CartProvider({ children }) {
  const { data: session, status } = useSession();
  const [cartProducts, setCartProducts] = useState([]);
  const ls = typeof window !== "undefined" ? window.localStorage : null;

  // Load giỏ hàng khi user đăng nhập
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email && ls) {
      const key = `cart_${session.user.email}`;
      const savedCart = ls.getItem(key);
      if (savedCart) {
        setCartProducts(JSON.parse(savedCart));
      } else {
        setCartProducts([]);
      }
    }

    // Nếu user logout → clear giỏ
    if (status === "unauthenticated") {
      setCartProducts([]);
    }
  }, [status, session?.user?.email]);

  // Tự động lưu mỗi khi giỏ thay đổi
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email && ls) {
      const key = `cart_${session.user.email}`;
      ls.setItem(key, JSON.stringify(cartProducts));
    }
  }, [cartProducts, session?.user?.email, status]);

  function addToCart(product, size = null, extras = []) {
    setCartProducts((prev) => {
      const cartProduct = { ...product, size, extras };
      const newCart = [...prev, cartProduct];
      return newCart;
    });
  }

  function removeCartProduct(indexToRemove) {
    setCartProducts((prev) => {
      const newCart = prev.filter((_, i) => i !== indexToRemove);
      return newCart;
    });
  }

  const clearCart = useCallback(() => {
    setCartProducts([]);
    if (status === "authenticated" && session?.user?.email && ls) {
      const key = `cart_${session.user.email}`;
      ls.setItem(key, JSON.stringify([]));
    }
  }, [status, session, ls]);

  return (
    <CartContext.Provider
      value={{
        cartProducts,
        setCartProducts,
        addToCart,
        removeCartProduct,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Gói SessionProvider bên ngoài
export default function AppProvider({ children }) {
  return (
    <SessionProvider>
      <CartProvider>{children}</CartProvider>
    </SessionProvider>
  );
}
