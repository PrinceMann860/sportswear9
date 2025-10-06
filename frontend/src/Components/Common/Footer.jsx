// src/components/Footer.jsx
import React from "react";

function Footer() {
  return (
    <footer className="bg-black text-white px-6 md:px-16 py-10">
      <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
        {/* PRODUCTS */}
        <div>
          <h3 className="font-bold mb-4">PRODUCTS</h3>
          <ul className="space-y-2 text-sm">
            <li>Footwear</li>
            <li>Clothing</li>
            <li>Accessories</li>
            <li>Outlet-Sale</li>
            <li>New Arrivals</li>
            <li>Flat 50% Off!</li>
          </ul>
        </div>

        {/* SPORTS */}
        <div>
          <h3 className="font-bold mb-4">Sports</h3>
          <ul className="space-y-2 text-sm">
            <li>Cricket</li>
            <li>Running</li>
            <li>Football</li>
            <li>Gym/Training</li>
            <li>Tennis</li>
            <li>Hiking & Outdoor</li>
            <li>Basketball</li>
            <li>Swimming</li>
            <li>Skateboarding</li>
          </ul>
        </div>

        {/* COLLECTIONS */}
        <div>
          <h3 className="font-bold mb-4">COLLECTIONS</h3>
          <ul className="space-y-2 text-sm">
            <li>Ultraboost</li>
            <li>Superstar</li>
            <li>NMD</li>
            <li>Stan Smith</li>
            <li>Sustainability</li>
            <li>Predator</li>
            <li>Parley</li>
            <li>Color</li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="font-bold mb-4">SUPPORT</h3>
          <ul className="space-y-2 text-sm">
            <li>Help</li>
            <li>UNiDAYS</li>
            <li>Customer Services</li>
            <li>Returns & Exchanges</li>
            <li>Shipping</li>
            <li>Order Tracker</li>
            <li>Store Finder</li>
            <li>SportsWear9Club</li>
            <li>SportsWear9Club Terms and conditions</li>
            <li>Sitemap</li>
          </ul>
        </div>

        {/* COMPANY INFO */}
        <div>
          <h3 className="font-bold mb-4">COMPANY INFO</h3>
          <ul className="space-y-2 text-sm">
            <li>About Us</li>
            <li>SportsWear9 stories</li>
            <li>SportsWear9 Apps</li>
            <li>Entity Details</li>
            <li>Press</li>
            <li>Careers</li>
          </ul>
          {/* Social Icons */}
          <div className="mt-4">
            <a href="#" className="text-xl">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-center items-center text-sm text-gray-400 text-center w-full ">
        <div className="flex space-x-6 mb-4 md:mb-0 text-center">
          <a href="#" className="hover:text-white font-semibold">
            Cookie Settings
          </a>
          <a href="#" className="hover:text-white">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white">
            Terms and Conditions
          </a>
          <a href="#" className="hover:text-white">
            Cookies
          </a>
        </div>
        <p className="mx-5">© 2025 SportsWear9</p>
      </div>
      </div>
    </footer>
  );
}

export default Footer;
