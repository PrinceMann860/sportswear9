import React from "react";
import { Link } from "react-router-dom";

const FestiveDealsGrid = ({ title = "Festive Steal Deals!", items = [] }) => {
  return (
    <div className="py-4 mb-8 bg-background">
      <div className="px-2 mx-auto sm:px-4 md:px-6 lg:px-12 xl:px-16">
        <div className="flex flex-wrap">
          <div className="w-full mb-4 px-4">
            <h2 className="font-bold uppercase text-base sm:text-lg md:text-xl">
              {title}
            </h2>
          </div>
        </div>
        <div className="flex flex-wrap">
          {items.map((item, index) => (
            <div
              key={index}
              className="mb-3.5 px-2 w-6/12 sm:w-4/12 md:w-3/12 lg:w-3/12"
            >
              <div className="max-w-full">
                <Link
                  to={item.link || "#"}
                  className="block"
                >
                  <div className="relative flex flex-col min-w-0 overflow-hidden bg-transparent border-none hover:scale-105 transition-transform duration-300">
                    <img
                      alt={item.name}
                      loading="lazy"
                      src={item.image}
                      className="w-full h-auto rounded-lg shadow-md hover:shadow-xl transition-shadow"
                    />
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FestiveDealsGrid;
