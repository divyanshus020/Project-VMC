import React from "react";

const categories = [
  {
    title: "Asht Pahlu",
    image:
      "https://aadyaa.com/cdn/shop/products/DSC09462_1b7d9d06-9ecd-4669-8d21-c53028db6ddf.jpg?v=1701175570&width=1200",
  },
  {
    title: "Cap",
    image:
      "https://rudrakshartjewellery.in/cdn/shop/files/89CB90E2-E2C8-4AE1-843C-50EA334FE48F_2048x2048.jpg?v=1698693660",
  },
  {
    title: "Capsule",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIMza89weJodF2_yzios4Zogs8UGvRmEUZGA&s",
  },
  {
    title: "Cone",
    image:
      "https://www.zahana.in/cdn/shop/files/IMG_2375_0113af75-dbb5-43f7-aee0-8bc2c925da20_1024x1024.jpg?v=1709030176",
  },
  {
    title: "Dholki",
    image:
      "https://aadyaa.com/cdn/shop/files/RGL0660_a9bf58dc-ed83-4e81-8c3e-b14da79cd37b.jpg?v=1745047769&width=1200",
  },
  {
    title: "Mani",
    image:
      "https://m.media-amazon.com/images/I/916fnwuR8fL._AC_UY300_.jpg",
  },
];

const TopCategoriesGrid = () => {
  return (
    <div className="py-8 px-2 bg-[#fdfdfd] w-full">
      <h2 className="text-3xl md:text-5xl font-bold font-serif text-center mb-6">
        Discover The Art Of Fine Jewelry
      </h2>
      <div className="flex flex-row flex-wrap justify-center gap-6 md:gap-10">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center min-w-[180px] max-w-[240px] sm:max-w-[260px] md:max-w-[300px] bg-white rounded-2xl shadow hover:shadow-xl transition-transform duration-200 hover:scale-105"
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