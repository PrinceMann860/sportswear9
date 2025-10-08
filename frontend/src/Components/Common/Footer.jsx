import React, { useState } from "react";
import { FaInstagram, FaFacebookF, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Footer() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleSection = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const sections = [
    {
      title: "Products",
      links: [
        "Footwear",
        "Clothing",
        "Accessories",
        "Outlet-Sale",
        "New Arrivals",
        "Flat 50% Off!",
      ],
    },
    {
      title: "Sports",
      links: [
        "Cricket",
        "Running",
        "Football",
        "Gym/Training",
        "Tennis",
        "Hiking & Outdoor",
      ],
    },
    {
      title: "Collections",
      links: [
        "Ultraboost",
        "Superstar",
        "Stan Smith",
        "Sustainability",
        "Predator",
        "Parley",
      ],
    },
    {
      title: "Support",
      links: [
        "Help",
        "Customer Services",
        "Returns & Exchanges",
        "Shipping",
        "Order Tracker",
        "Store Finder",
      ],
    },
    {
      title: "Company Info",
      links: [
        "About Us",
        "SportsWear9 Stories",
        "SportsWear9 Apps",
        "Press",
        "Careers",
      ],
    },
  ];

  return (
    <footer className="bg-black text-gray-300 px-6 sm:px-10 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-5 gap-8">
          {sections.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
                {section.title}
              </h3>
              <ul className="space-y-2 text-xs">
                {section.links.map((link, i) => (
                  <li
                    key={i}
                    className="hover:text-white cursor-pointer transition-colors"
                  >
                    {link}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mobile Accordion */}
        <div className="md:hidden flex flex-col divide-y divide-gray-700">
          {sections.map((section, idx) => (
            <div key={idx}>
              <button
                onClick={() => toggleSection(idx)}
                className="w-full flex justify-between items-center py-3 text-sm text-white font-medium"
              >
                {section.title}
                <span className="text-gray-400">
                  {openIndex === idx ? "−" : "+"}
                </span>
              </button>
              {openIndex === idx && (
                <ul className="pl-2 pb-3 space-y-2 text-xs text-gray-400">
                  {section.links.map((link, i) => (
                    <li
                      key={i}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      {link}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Social + Bottom */}
        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 space-y-4 sm:space-y-0">
          <div className="flex items-center gap-5 text-lg text-gray-400">
            <a href="#" className="hover:text-white">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-white">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-white">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-white">
              <FaYoutube />
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <a href="#" className="hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white">
              Terms & Conditions
            </a>
            <a href="#" className="hover:text-white">
              Cookie Settings
            </a>
          </div>

          <p className="text-gray-500">© 2025 SportsWear9. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
