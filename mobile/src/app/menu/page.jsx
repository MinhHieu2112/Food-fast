// //Trang menu

// 'use client';
// import {useState, useEffect} from "react"
// import SectionHeaders from "@/components/layout/sectionHeader"
// import MenuItem from "@/components/menu/menuItem"

// export default function MenuPage() {
//     const [categories, setCategories] = useState([]);
//     const [menuItems, setMenuItems] = useState([]);
//     useEffect(() => {
//         fetch('/api/categories')
//             .then(res => {res.json()
//             .then(categories => setCategories(categories));
//         });
//         fetch('/api/menu-items')
//             .then(res => {res.json()
//             .then(menuItems => setMenuItems(menuItems));
//         });
//     }, []);
//     return (
//         <section className="mt-8">
//             {categories?.length > 0 && categories.map(c => (
//                 <div key={c._id}>
//                     <div className="text-center">
//                         <SectionHeaders mainHeader={c.name}/>
//                     </div>
//                     <div className="grid sm:grid-cols-3 gap-4 mt-6 mb-12">
//                         {menuItems.filter(item => item.category === c._id).map(item =>(
//                         <MenuItem {...item} key={item._id} />
//                     ))}
//                     </div>
//                 </div>
//             ))}
//         </section>
//     );
// }

'use client';

import { useState, useEffect } from "react";
import SectionHeaders from "@/components/layout/sectionHeader";
import MenuItem from "@/components/menu/menuItem";

export default function MenuPage() {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((cats) => {
        setCategories(cats);
        if (cats.length > 0) setActiveCategory(cats[0]._id);
      });

    fetch("/api/menu-items")
      .then((res) => res.json())
      .then((items) => setMenuItems(items));
  }, []);

  const filteredItems = menuItems.filter(
    (item) => item.category === activeCategory
  );

  return (
    <section className="mt-12 max-w-6xl mx-auto px-4">
      {/* Tabs categories */}
      <div className="flex flex-wrap justify-center gap-6 border-b border-gray-300 pb-4 mb-10">
        {categories.map((c) => (
          <button
            key={c._id}
            onClick={() => setActiveCategory(c._id)}
            className={`text-lg font-semibold transition-all duration-300 ${
              activeCategory === c._id
                ? "text-red-500 border-b-4 border-red-500 pb-1"
                : "text-gray-600 hover:text-red-400"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Header */}
      {activeCategory && (
        <div className="text-center mb-6">
          <SectionHeaders
            mainHeader={
              categories.find((c) => c._id === activeCategory)?.name || ""
            }
          />
        </div>
      )}

      {/* Menu Items */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <MenuItem key={item._id} {...item} />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          No items in this category yet.
        </p>
      )}
    </section>
  );
}
