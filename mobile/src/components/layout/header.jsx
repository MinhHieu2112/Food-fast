'use client'
import { signOut } from "next-auth/react";
import useUserName from "@/hooks/useUserName";
import Link from "next/link";
import {useContext} from "react";
import { CartContext } from "@/components/AppContext";
import Cart from "@/components/icons/cart";
import OrderIcon from "@/components/icons/order"
import UseProfile from "@/components/UseProfile";
import UserTab from "@/components/layout/tabs"

export default function Header() {
    const { userName, status } = useUserName();
    const {cartProducts} = useContext(CartContext);
    const { loading, data: profile } = UseProfile();
    const isAdmin = profile?.isAdmin;
    return (
    <header className="flex items-center justify-between">
      <nav className="flex items-center gap-8 text-gray-500 font-semibold">
        <Link className="text-primary font-semibold text-2xl" href={'/'}>ST PIZZA</Link>
        {isAdmin ? (
            <>
              <UserTab isAdmin={true}/>
            </>
          ) : (
            <>
              <Link href={'/'}>Home</Link>
              <Link href={'/menu'}>Menu</Link>
              <Link href={'/#about'}>About</Link>
              <Link href={'/#contact'}>Contact</Link>
            </>
          )}
      </nav>
      <nav className="flex items-center gap-8 text-gray-500 font-semibold">
        {status === 'authenticated' && (
          <>
          {!isAdmin && (
            <>
              <Link href={'/cart'} className="relative"> 
              <Cart/> 
              {cartProducts?.length > 0 && (
                <span className="absolute -top-2 -right-4 bg-primary text-white text-xs py-1 px-1 rounded-full leading-3">
                {cartProducts.length}
                </span>
              )}
              </Link>
              <Link href={'/orders'} className="relative"> 
                <OrderIcon className="w-6 h-6"/>
              </Link>
            </>
          )}
          <Link href={'/profile'} className="whitespace-nowrap">
            Hello, {userName}
          </Link>
          <button 
            onClick={() => signOut()}
            className="bg-primary rounded-full text-white px-8 py-2">Logout
          </button>
          </>
        )}
        {status === 'unauthenticated' && (
          <>
            <Link href={'/login'}> Login </Link>
            <Link href={'/register'} className="bg-primary rounded-full
         text-white px-8 py-2"> Register </Link>
          </>
        )}
      </nav>
    </header>
    );
}