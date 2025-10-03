import Header from "@/components/layout/header";
import Hero from "@/components/layout/hero";
import HomeMenu from "@/components/layout/homeMenu"
import SectionHeaders from "@/components/layout/sectionHeader";
export default function Home() {
  return (
   <>
    <Hero />
    <HomeMenu />
    <section className="text-center my-16">
      <SectionHeaders
      subHeader={'Our story'}
      mainHeader={'About us'}
      />
      <div className="text-gray-500 max-w-md mx-auto mt-4 flex flex-col gap-4">
        <p>
          We believe that a great pizza is not only about the gooey cheese or the crispy crust, but also about the passion we put into every step of preparation. We carefully select fresh ingredients every day and blend them with our signature recipes to create flavors that are both familiar and unique.
        </p>
        <p>
          Our mission is to bring you hot, freshly baked pizzas with authentic Italian taste, while still being close to the Vietnamese palate. Whether you enjoy dining in or ordering takeaway, we want every slice to be a perfect moment to share with family and friends.
        </p>
      </div>
    </section>
    <section className="text-center my-8">
      <SectionHeaders 
        subHeader={'Dont\'t hesitate'}
        mainHeader={'Contact us'} 
        />
        <div className="mt-8">
          <a className="text-4xl underline text-gray-500" 
          href="tel:+1234567899">
            +1 234 567 899
          </a>
        </div>
    </section>
   </>
  );
}
