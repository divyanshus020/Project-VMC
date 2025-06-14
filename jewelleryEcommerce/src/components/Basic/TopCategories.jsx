import React from "react";
import { useNavigate } from "react-router-dom";
import AsthaPahlu from "../../assets/For Web/Asth-Pahlu/Asthapashu1.png";
import Capsule from "../../assets/For Web/Capsule/Capsule1.png";
import Dholki from "../../assets/For Web/Dholki/Dholki1.png";
import Cone from "../../assets/For Web/Cone/Cone1.png"
import Cap from "../../assets/For Web/Double V-Cut Cap/Cap1.png"
import Mani from "../../assets/For Web/MANI.png";

const categories = [
  {
    title: "Asht Pahlu",
    image: AsthaPahlu,
    slug: "asht-pahlu"
  },
  {
    title: "Cap",
    image: Cap,
    slug: "cap"
  },
  {
    title: "Capsule",
    image: Capsule,
    slug: "capsule"
  },
  {
    title: "Cone",
    image: Cone,
    slug: "cone"
  },
  {
    title: "Dholki",
    image: Dholki,
    slug: "dholki"
  },
  {
    title: "Mani",
    image: Mani,
    slug: "mani"
  },
];

const TopCategoriesGrid = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    // Navigate to products page with category filter
    navigate(`/products?category=${category.slug}`, { 
      state: { categoryName: category.title } 
    });
  };

  return (
    <div className="py-8 px-2 bg-[#fdfdfd] w-full">
      <h2 className="text-3xl md:text-5xl font-bold font-serif text-center mb-6">
        Discover The Art Of Fine Jewelry
      </h2>
      <div className="flex flex-row flex-wrap justify-center gap-6 md:gap-10">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            onClick={() => handleCategoryClick(cat)}
            className="flex flex-col items-center min-w-[180px] max-w-[240px] sm:max-w-[260px] md:max-w-[200px] bg-white rounded-2xl shadow hover:shadow-xl transition-transform duration-200 hover:scale-105 cursor-pointer"
          >
            <img
              src={cat.image}
              alt={cat.title}
              className="w-[160px] h-[120px] sm:w-[200px] sm:h-[160px] md:w-[260px] md:h-[200px] lg:w-[300px] lg:h-[300px] object-cover rounded-t-2xl"
            />
            <div className="py-4 w-full text-center">
              <span className="text-base sm:text-lg font-semibold font-serif">{cat.title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCategoriesGrid;