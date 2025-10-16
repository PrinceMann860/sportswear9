// SportsCategorySection.jsx
import React from "react";
import trouser from "../../assets/trouser.png";
import skates from "../../assets/skates.png";
import nba from "../../assets/nba.png";
import footballshoes from "../../assets/footballshoes.png";

const categories = [
  { title: "Sports Trousers", image: trouser, price: 499 },
  { title: "Skates & Skateboards", image: skates, price: 1099 },
  { title: "NBA Collection", image: nba, price: 699 },
  { title: "Basketball & Football Shoes", image: footballshoes, price: 999 },
];

const SportsCategorySection = () => {
  return (
    <section className="w-full p-4 md:p-8 lg:p-12 xl:px-20">
      <h2 className="text-xl md:text-3xl lg:text-4xl font-bold mb-6">
        EQUIPPING CHAMPIONS
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 lg:gap-12 xl:gap-20 2xl:gap-40">
        {categories.map((item, index) => (
          <div
            key={index}
            style={{
              backgroundImage:
                "url(https://wallpapers.com/images/hd/white-texture-background-dsqck1aznlrzk1az.jpg)",
            }}
            className="bg-center bg-cover bg-no-repeat rounded-t-full p-4 flex flex-col items-center justify-between transition-transform hover:scale-105 shadow-[inset_0_0_20px_rgba(0,0,0,0.2)]"
          >
            <h3 className="text-center mt-10 mx-auto font-bold text-sm md:text-base lg:text-xl xl:text-2xl 2xl:text-3xl  w-[70%] sm:w-[65%] xl:w-[50%]">
              {item.title}
            </h3>

            <img
              src={item.image}
              alt={item.title}
              className="w-3/4 md:w-2/3 lg:w-1/2 object-contain my-4"
            />

            <div className="text-left w-full">
              <p className="text-xs md:text-sm lg:text-xl font-semibold">
                Starting From
              </p>
              <p className="text-blue-600 text-lg md:text-2xl lg:text-3xl xl:text-6xl font-bold italic">
                ₹{item.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SportsCategorySection;
