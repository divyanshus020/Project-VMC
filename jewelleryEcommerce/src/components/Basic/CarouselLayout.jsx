import React from "react";
import { Carousel } from "react-responsive-carousel";
import { useNavigate } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Carousel styles

const DiscoverJewellery = () => {
  const navigate = useNavigate();

  const leftCarouselImages = [
    {
      src: "https://i.pinimg.com/736x/ff/9c/20/ff9c204f62b65141a988cde3c7b1484f.jpg",
      alt: "Layered gold and turquoise necklaces",
    },
    {
      src: "https://media.istockphoto.com/id/1276740597/photo/indian-traditional-gold-necklace.jpg?s=612x612&w=0&k=20&c=OYp1k0OVJObYq9hqVK_r6NwYa_W54km4nya1R-ovIUY=",
      alt: "Pearl and diamond necklace",
    },
    {
      src: "https://img.freepik.com/free-photo/gold-jewellery-table-with-other-gold-jewellery_1340-42836.jpg",
      alt: "Golden choker design",
    },
  ];

  const rightCarouselImages = [
    {
      src: "https://www.financialexpress.com/wp-content/uploads/2023/11/gold-jewellery-pixabay.jpg",
      alt: "Gold and diamond earring with ear cuff",
    },
    {
      src: "https://media.istockphoto.com/id/147250575/photo/three-yellow-studded-bangles-on-a-black-background.jpg?s=612x612&w=0&k=20&c=MjU2waBbnCkywENHTgoXteNT31r5vZ_H2q--4Pvn3Hc=",
      alt: "Promotional diamond ring",
    },
    {
      src: "https://astrotalk.com/astrology-blog/wp-content/uploads/2023/08/desktop-wallpaper-gold-jewellery-design-gold-jewelry.jpg",
      alt: "Reward card promo",
    },
  ];

  return (
    <div className="bg-white font-serif">
      <div className="max-w-6l mx-auto p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Left Carousel: 30% width on sm+ screens */}
          <div className="w-full sm:w-[30%] rounded-[12px] overflow-hidden relative">
            <Carousel
              showThumbs={false}
              showStatus={false}
              infiniteLoop
              autoPlay
              interval={4000}
              stopOnHover
              className="rounded-[12px]"
            >
              {leftCarouselImages.map((item, index) => (
                <div key={index}>
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-[400px] object-cover rounded-[12px]"
                  />
                </div>
              ))}
            </Carousel>
          </div>

          {/* Right Carousel: 70% width on sm+ screens */}
          <div className="w-full sm:w-[70%] rounded-[12px] overflow-hidden relative">
            <Carousel
              showThumbs={false}
              showStatus={false}
              infiniteLoop
              autoPlay
              interval={4000}
              stopOnHover
              className="rounded-[12px]"
            >
              {rightCarouselImages.map((item, index) => (
                <div key={index} className="relative">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-[400px] object-cover rounded-[12px]"
                  />
                  {/* Button positioned at bottom left */}
                  <button
                    onClick={() => navigate("/products")}
                    className="absolute bottom-6 left-6 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded shadow transition"
                  >
                    Our Products
                  </button>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverJewellery;