// import Header from "@/components/layout/header";
// import Hero from "@/components/layout/hero";
// import HomeMenu from "@/components/layout/homeMenu"
// import SectionHeaders from "@/components/layout/sectionHeader";
// export default function Home() {
//   return (
//    <>
//     <Hero />
//     <HomeMenu />
//     <section className="my-20 px-6" id="about">
//       <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        
//         {/* LEFT - Image */}
//         <div className="relative">
//           <img 
//             src="/pizza-photography.jpg" 
//             alt="Our Story" 
//             className="rounded-2xl shadow-lg w-full object-cover"
//           />
//           <div className="absolute -bottom-6 -right-6 bg-primary text-white px-6 py-3 rounded-xl shadow-md font-semibold">
//             🍕 Since 2015
//           </div>
//         </div>

//         {/* RIGHT - Text Content */}
//         <div className="text-center md:text-left">
//           <h3 className="text-primary uppercase tracking-wide font-semibold text-sm">
//             Our Story
//           </h3>
//           <h2 className="text-4xl font-bold text-gray-800 mt-2 mb-6">
//             About <span className="text-primary">ST Pizza</span>
//           </h2>
//           <p className="text-gray-600 leading-relaxed mb-4">
//             At ST Pizza, we believe a great pizza isn’t just about the cheese or the crust — 
//             it’s about the love and dedication we pour into every single slice. 
//             We handpick the freshest ingredients daily and combine them with our secret recipes 
//             to deliver a flavor that feels both comforting and exciting.
//           </p>
//           <p className="text-gray-600 leading-relaxed mb-6">
//             Our mission is simple: bring you freshly baked pizzas that blend authentic Italian taste 
//             with the warmth of Vietnamese hospitality. 
//             Whether dining in or ordering takeaway, every bite is made to create joyful moments 
//             with family and friends.
//           </p>
//           {/* <button className="bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-red-600 transition">
//             Learn more
//           </button> */}
//         </div>
//       </div>
//     </section>
//     <section className="py-5 bg-gradient-to-b from-white to-gray-50" id="contact">
//       <div className="max-w-4xl mx-auto text-center px-6">
//         <SectionHeaders 
//           subHeader={"Don't hesitate"} 
//           mainHeader={"Contact us"} 
//         />

//         <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
//           Whether you have questions about our menu, delivery, or want to share your feedback — 
//           we’re here to help! Get in touch with us anytime.
//         </p>

//         <div className="mt-12 grid md:grid-cols-3 gap-8 text-gray-700">
//           {/* 📞 Phone */}
//           <div className="flex flex-col items-center p-6 rounded-2xl shadow-md bg-white hover:shadow-lg transition">
//             <div className="bg-primary/10 p-4 rounded-full mb-4">
//               📞
//             </div>
//             <h4 className="text-lg font-semibold mb-1">Call us</h4>
//             <a 
//               href="tel:+1234567899" 
//               className="text-primary text-xl font-medium hover:underline"
//             >
//               +1 234 567 899
//             </a>
//           </div>

//           {/* ✉️ Email */}
//           <div className="flex flex-col items-center p-6 rounded-2xl shadow-md bg-white hover:shadow-lg transition">
//             <div className="bg-primary/10 p-4 rounded-full mb-4">
//               ✉️
//             </div>
//             <h4 className="text-lg font-semibold mb-1">Email</h4>
//             <a 
//               href="mailto:contact@stpizza.com" 
//               className="text-primary font-medium hover:underline"
//             >
//               contact@stpizza.com
//             </a>
//           </div>

//           {/* 📍 Location */}
//           <div className="flex flex-col items-center p-6 rounded-2xl shadow-md bg-white hover:shadow-lg transition">
//             <div className="bg-primary/10 p-4 rounded-full mb-4">
//               📍
//             </div>
//             <h4 className="text-lg font-semibold mb-1">Visit us</h4>
//             <p className="text-gray-600">
//               123 Pizza Street, HCMC
//             </p>
//           </div>
//         </div>

//         <div className="mt-12">
//           <p className="text-gray-500 text-sm">
//             Working hours: <span className="font-medium text-gray-700">10:00 AM - 10:00 PM</span> (Mon - Sun)
//           </p>
//         </div>
//       </div>
//     </section>
//    </>
//   );
// }

'use client';
import Hero from "@/components/layout/hero";
import HomeMenu from "@/components/layout/homeMenu";
import SectionHeaders from "@/components/layout/sectionHeader";
import UseProfile from "@/components/UseProfile";

export default function Home() {
  const { loading, data: profile } = UseProfile();
  const isCustomer = profile?.role === 'customer';

  return (
    <>
      {/* Hero: admin có thể hiển thị nút admin */}
      <Hero/>

      {/* Nếu là Customer, hiển thị các phần bình thường */}
      {isCustomer && (
        <>
          {/* Menu Section */}
          <HomeMenu />

          {/* About Section */}
          <section className="my-20 px-6" id="about">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
              
              {/* LEFT - Image */}
              <div className="relative">
                <img 
                  src="/pizza-photography.jpg" 
                  alt="Our Story" 
                  className="rounded-2xl shadow-lg w-full object-cover"
                />
                <div className="absolute -bottom-6 -right-6 bg-primary text-white px-6 py-3 rounded-xl shadow-md font-semibold">
                  🍕 Since 2015
                </div>
              </div>

              {/* RIGHT - Text Content */}
              <div className="text-center md:text-left">
                <h3 className="text-primary uppercase tracking-wide font-semibold text-sm">
                  Our Story
                </h3>
                <h2 className="text-4xl font-bold text-gray-800 mt-2 mb-6">
                  About <span className="text-primary">ST Pizza</span>
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  At ST Pizza, we believe a great pizza isn’t just about the cheese or the crust — 
                  it’s about the love and dedication we pour into every single slice. 
                  We handpick the freshest ingredients daily and combine them with our secret recipes 
                  to deliver a flavor that feels both comforting and exciting.
                </p>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Our mission is simple: bring you freshly baked pizzas that blend authentic Italian taste 
                  with the warmth of Vietnamese hospitality. 
                  Whether dining in or ordering takeaway, every bite is made to create joyful moments 
                  with family and friends.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="py-5 bg-gradient-to-b from-white to-gray-50" id="contact">
            <div className="max-w-4xl mx-auto text-center px-6">
              <SectionHeaders 
                subHeader={"Don't hesitate"} 
                mainHeader={"Contact us"} 
              />

              <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                Whether you have questions about our menu, delivery, or want to share your feedback — 
                we’re here to help! Get in touch with us anytime.
              </p>

              <div className="mt-12 grid md:grid-cols-3 gap-8 text-gray-700">
                {/* Phone */}
                <div className="flex flex-col items-center p-6 rounded-2xl shadow-md bg-white hover:shadow-lg transition">
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    📞
                  </div>
                  <h4 className="text-lg font-semibold mb-1">Call us</h4>
                  <a 
                    href="tel:+1234567899" 
                    className="text-primary text-xl font-medium hover:underline"
                  >
                    +1 234 567 899
                  </a>
                </div>

                {/* Email */}
                <div className="flex flex-col items-center p-6 rounded-2xl shadow-md bg-white hover:shadow-lg transition">
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    ✉️
                  </div>
                  <h4 className="text-lg font-semibold mb-1">Email</h4>
                  <a 
                    href="mailto:contact@stpizza.com" 
                    className="text-primary font-medium hover:underline"
                  >
                    contact@stpizza.com
                  </a>
                </div>

                {/* Location */}
                <div className="flex flex-col items-center p-6 rounded-2xl shadow-md bg-white hover:shadow-lg transition">
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    📍
                  </div>
                  <h4 className="text-lg font-semibold mb-1">Visit us</h4>
                  <p className="text-gray-600">
                    123 Pizza Street, HCMC
                  </p>
                </div>
              </div>

              <div className="mt-12">
                <p className="text-gray-500 text-sm">
                  Working hours: <span className="font-medium text-gray-700">10:00 AM - 10:00 PM</span> (Mon - Sun)
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
