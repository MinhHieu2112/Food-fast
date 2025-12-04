// import Image from "next/image";
// import Right from "@/components/icons/right";
// export default function Hero() {
//     return (
//         <section className="hero mt-4">
//           <div className="py-12">
//             <h1 className="text-4xl font-semibold">
//                 Everything <br />
//                 is better <br />
//                 with a&nbsp; 
//                 <span className="text-primary">
//                     pizza
//                 </span>
//             </h1>
//             <p className="my-6 text-gray-500 text-sm">
//                 Pizza is the missing piece that makes every
//                 day complete, a simple yet delicious joy in
//                 life
//             </p>
//             <div className="flex gap-4 text-sm">
//                 <button className="justify-center bg-primary uppercase flex items-center gap-2 text-white px-4 py-2 rounded-full">Order now
//                     <Right />
//                 </button>
//                 <button className="flex items-center border-0 gap-2 py-2 text-gray-600 font-semibold">Learn more
//                     <Right />
//                 </button>
//             </div>
//           </div>
//             <div className="relative">
//                 <Image src={'/seafood-pizza.jpg'} layout={'fill'} 
//                 objectFit={'contain'} alt={'pizza'}
//                 />
//             </div>
//         </section>
//     );
// }

'use client';
import Image from "next/image";
import Right from "@/components/icons/right";
import UseProfile from "@/components/UseProfile";
import Link from "next/link";

export default function Hero() {
  const { loading, data: profile } = UseProfile();
  const role = profile?.role;
  const isCustomer = role === 'customer';

  return (
    <section className="hero mt-4">
      <div className="py-12">
        {!isCustomer ? (
          <>
            <h1 className="text-4xl font-semibold">
              Welcome back!  <br />
              Manage your <span className="text-primary">dashboard</span>
            </h1>
            <p className="my-6 text-gray-500 text-sm">
              Here you can manage orders, menus, and categories.
            </p>
            <div className="flex gap-4 text-sm">
              <Link href="/dashboard" className="justify-center bg-primary uppercase flex items-center gap-2 text-white px-4 py-2 rounded-full">
                Go to Dashboard <Right />
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-semibold">
              Everything <br />
              is better <br />
              with a&nbsp; 
              <span className="text-primary">pizza</span>
            </h1>
            <p className="my-6 text-gray-500 text-sm">
              Pizza is the missing piece that makes every
              day complete, a simple yet delicious joy in
              life
            </p>
            <div className="flex gap-4 text-sm">
              <button className="justify-center bg-primary uppercase flex items-center gap-2 text-white px-4 py-2 rounded-full">
                Order now <Right />
              </button>
              <button className="flex items-center border-0 gap-2 py-2 text-gray-600 font-semibold">
                Learn more <Right />
              </button>
            </div>
          </>
        )}
      </div>
      <div className="relative w-full h-96">
        <Image 
          src={!isCustomer ? '/admin-hero.jpg' : '/seafood-pizza.jpg'} 
          layout="fill" 
          objectFit="contain" 
          alt="hero"
        />
      </div>
    </section>
  );
}
