import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";
import AuthModal from "../Auth/AuthModal"; 
import { useState } from "react";

const Footer = () => {
  // ===== AUTH MODAL STATES (same as Navbar) =====
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const openLogin = () => {
    setAuthMode("login");
    setAuthOpen(true);
  };

  const openRegister = () => {
    setAuthMode("signup");
    setAuthOpen(true);
  };
  return (
    <>
      {/* ===== AUTH MODAL ===== */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        mode={authMode}
        setMode={setAuthMode}
      />
    <footer className="w-full bg-white text-gray-700 text-sm overflow-x-hidden">
      {/* === OUR SPORT COLLECTIONS === */}
      <div className="mx-auto px-4 py-6 border-b overflow-hidden">
        <h2 className="text-lg font-bold mb-2">Our Sport Collections :</h2>
        <div className="flex flex-wrap gap-x-2 leading-relaxed overflow-hidden">
          {[
            "Badminton : Badminton Racket | Adult Badminton Racket | Junior Badminton Racket | Badminton Shoes | Mens Badminton Shoes | Womens Badminton Shoes | Kids Badminton Shoes | Badminton Jersey | Mens Badminton Jerseys | Womens Badminton Jerseys | Kids Badminton Apparels | Badminton Shorts | Mens Badminton Shorts | Womens Badminton Shorts and Skirts | Shuttlecocks | Plastic Shuttlecocks | Feather Shuttlecocks | Badminton Accessories | Badminton Grips | Badminton Net | Badminton Racket Strings | Badminton Training Bands | Racket Cover Bags |",
            "Tennis : Tennis Rackets | Tennis Balls | Tennis Shoes | Tennis Tshirts | Tennis Shorts | Tennis Skirts | Tennis Socks | Tennis Accessories | Tennis Cover and Bags | Tennis Grips | Tennis Equipments |",
            "Table Tennis : Table Tennis Rackets | Table Tennis Balls | Table Tennis Shoes | Table Tennis Accessories | Table Tennis Nets | Table Tennis Racket Covers | Table Tennis Tables |",
            "Squash : Squash Rackets | Squash Balls | Squash Shoes | Squash Accessories | Squash Kit Bags |",
            "Hiking & Trekking : Hiking Shoes | Men Hiking Shoes | Women Hiking Shoes | Kids Hiking Shoes | Trekking Shoes | Men Trekking Shoes | Women Trekking Shoes | Hiking and Trekking Tshirts | Men Hiking and Trekking Tshirts | Women Hiking and Trekking Tshirts | Kids Hiking and Trekking Tshirts | Hiking and Trekking Shorts and Skirts | Men Hiking and Trekking Shorts | Women Hiking and Trekking Shorts/Skirts | Kids Hiking and Trekking Shorts/Skirts | Hiking and Trekking Pants | Men Hiking and Trekking Pants/Cargos | Women Hiking and Trekking Pants/Leggings | Kids Hiking and Trekking Pants | Hiking Poles | Adult Hiking Poles | Kids Hiking Poles | Hiking Pole Accessories | Hiking Compass | Hiking Bags | 10-40L Hiking Backpacks | Trekking Backpacks & Rucksacks | Men Trekking Backpacks | Women Trekking Backpacks | Hiking Water Bottles | Hiking Headlamps | Hiking and Trekking Equipment | Hiking and Trekking Binoculars | Hiking and Trekking Clothing | Sleeping Bags, Liners and Pillows | Trekking Tents |",
            "Gym Equipment : Gym Equipment | Home Gym Equipments | Dumbbell Sets | Dumbbell Sets and Weights | Ellipticals and Cross Trainers | Treadmills and Steppers | Exercise Bike and Spin Bike | Weights Racks Plates Bars | Kettlebells | Ankle Weights | Adjustable Dumbbells | Gym Bench and Squat Rack | Boxing Equipments | Trampolines | Rowers | Weighing Machine | Yoga Mats |",
            "Camping : Tents | Chairs | Tables | Furnitures | Sleeping bags | Mattresses | Camping Accessories | Cooksets |",
            "Gym Track pants : Gym Shorts | Gym Track pants | Gym Shorts | Men Tracksuits | Women Gym suits | Sports Bra | Gym Tops | Women fitness jacket |",
            "Skiing : Men Thermals | Women Thermals | Beanies | | Winter Accessories | Warmers | Junior Jackets | Junior Beanies | Ski jackets |",
            "Wildlife : Camo Tshirts | Camo Trousers | Camo Bermudas | Camo Caps | Gum Boots | Binoculars | | Shelter | Umbrellas | Pouches |",
            "Cycle : Bike Racks | Cycles | Mountain Cycles | Hybrid Cycles | Road Bikes | Kids Cycle | Cycle Accessories |",
            "Road Cycle : Bike Racks | Cycles | Mountain Bikes | Hybrid Cycles | Road Bikes | Kids Cycle | Cycle Accessories |",
            "Fishing : Fishing Rods | Fishing Reels | Hooks | Lures | Fishing lines | Fishing Accessories | Fishing Camp Furnitures | Fishing ponchos | Fishing GIlet |",
            "Horse Riding : Horse riding helmets | Breeches | Horse riding boots | Horse riding gloves | Leather saddle | Cloth saddle |",
            "Swimming : Swimming costumes | Swimming cap | Swimming goggles | Towels | Bathrobes | Flipflops | Swimming equipments | Aqua learning | Buoyancy aids |",
            "Football : Football | Football shoes | Football bag | Football Jersey | Football shorts | Football Socks | Goal Posts | Training accessories | Goalkeeper Kit | Football Equipment |",
            "Cricket : Tennis Cricket bat | English Willow Bat | Kids cricket bat | Cricket ball | Cricket accessories | Adult cricket shoes | Kids cricket shoes | Cricket track pants | Cricket jersey |",
            "Surfing : Board shorts | Frisbee | shorts2 | Wetsuits | Bodyboards | Kites | Snorkelling | Scuba diving | Kayaks | Standup paddle |",
            "Running : | Jogging shoes | | Running Tshirts | Running shorts | Running Tights | | Sports watch | Weighing scale | Earphones |",
            "Golf : Golf clubs | Golf trolleys | Golf balls | Golf accessories | Polo Tshirts | Golf Trouser | Golf shoes | Golf caps | Golf shorts |",
            "Skateboard : Skateboard | Long boards | Waveboard | Skateboard shoes | Skateboard accessories | Kids scooters | Adult scooters | Spares | Scooter helmets |",
            "Roller skating : Quad Roller skates | Inline skates | Kids Inline skates | Adult Inline skates | Skating Helmets | Skating guards | Skating bags | Skating spares accessories |",
            "Winter Collection : We provide a wide range of Winter Jackets, Winter shoes, Sweaters, Fleece, Pullover, Down jacket, Beanies, Gloves, Snow jacket, Arctic winter jacket, Woolen socks and with more winter categories. |",
            "Men Winter Collections : Men Sweaters | Men Fleece Jacket | | Men Sweatshirt | Men Hoodies | Men Winter Coat | | Men Puffer Jacket | Men Down Jacket | Men Snow Jacket | Men Bomber Jacket | Winter Shoes | Men Winter Shoes | Snow Socks | Men Winter Outfits | Men Winter Tshirt | Men Thermals | Men Warm Trouser |",
            "Women Winter Collection : Women Sweaters | Women Fleece Jacket | Women Pullover | Women Sweatshirt | Women Jackets | Women Winter Jacket | Women Puffer Jacket | Women Down Jacket | Women Snow Jacket | Women Bomber Jacket | Women Snow Shoes | Women Winter Outfits | Women Thermals | Women Warm Trouser | ",
          ].map((row, idx) => (
            <p key={idx} className="w-full break-words overflow-hidden">
              {row.split("|").map((link, i) => (
                <Link
                  key={i}
                  to="#"
                  className="hover:underline inline break-words"
                >
                  {link.trim()}{" "}
                </Link>
              ))}
            </p>
          ))}
        </div>
      </div>

      {/* === PROMISE STRIP === */}
      <div className="bg-gray-100 py-4 border-b overflow-hidden">
        <div className="flex w-[100%] gap-10 md:gap-0">
        <div className="flex w-[10%] md:w-[20%]">
          <span className="font-bold md:text-xl ml-2 md:ml-10">Our Promise</span>
        </div>
        <div className="w-[80%] flex justify-evenly items-center md:px-4">
          <div className="flex items-center gap-2 text-xs md:text-sm">
            <span className="text-2xl">💳</span> <span className="hidden lg:inline">No Cost EMI Available*</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-2xl">↩️</span> <span className="hidden lg:inline">Easy Returns*</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-2xl">😊</span> <span className="hidden lg:inline">1 million+ happy Customers</span>
          </div>
        </div>
        </div>
      </div>

      {/* === LOWER FOOTER SECTIONS === */}
      <div className="lg:flex overflow-hidden">
        <div className="w-full lg:w-[80%] mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* SUPPORT */}
          <div className="ml-2 md:ml-5 lg:ml-10">
            <h3 className="font-bold mb-2">SUPPORT</h3>
            <Link to="https://wa.me/0000000000?text=Hello%20this%20is%20a%20test" className="block hover:underline">
              Contact our Stores
            </Link>
            <Link to="/contact" className="block hover:underline">
              Contact
            </Link>
            <Link to="/SizeGuide" className="block hover:underline">
              Size Guide
            </Link>
            <Link to="/ShippingDelivery" className="block hover:underline">
              Shipping & Delivery
            </Link>
            <Link to="/privacypolicy" className="block hover:underline">
              Terms & Conditions
            </Link>
            <Link to="/Cancellation" className="block hover:underline">
              Cancellation, Return & Exchange Policy
            </Link>
            <Link to="/ReturnRefund" className="block hover:underline">
              Refund & Return Policy
            </Link>
          </div>

          {/* My Account */}
          <div>
            <h3 className="font-bold mb-2">My Account</h3>
            
              <button
                onClick={openLogin}
                className="block text-left hover:underline w-full"
              >
                Login
              </button>

              <button
                onClick={openRegister}
                className="block text-left hover:underline w-full"
              >
                Register
              </button>

              <Link to="/orders" className="block hover:underline">
                Track Your Order
              </Link>
          </div>

          {/* ABOUT US */}
          <div>
            <h3 className="font-bold mb-2">ABOUT US</h3>
            <Link to="/OurStory" className="block hover:underline">
              Who we are/Our Story
            </Link>
            <Link to="/Careers" className="block hover:underline">
              Careers
            </Link>
            Made in India
          </div>

          {/* Brands */}
          <div>
            <h3 className="font-bold mb-2">Brands</h3>
            <Link to="/brand/Gymific" className="block hover:underline">
              Gymfic
            </Link>
            <Link to="/brand/KyK" className="block hover:underline">
              KYK
            </Link>
            <Link to="/brand/NeverLose" className="block hover:underline">
              Never-Lose
            </Link>
            <Link to="/brand/Ninq" className="block hover:underline">
              Ninq
            </Link>
            <Link to="/brand/Sportsinger" className="block hover:underline">
              Sportsinger
            </Link>
            <Link to="/brand/Train Hard" className="block hover:underline">
              Train Hard
            </Link>
            <Link to="/brand/U" className="block hover:underline">
              U
            </Link>
            <Link to="/brand/WMX" className="block hover:underline">
              WMX
            </Link>
            <Link to="/brand/Work for it" className="block hover:underline">
              Work for it
            </Link>
          </div>
        </div>

        {/* === RIGHT SIDE SECTION (APP + SOCIAL + INPUTS) === */}
        <div className="w-full lg:w-[20%] mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6 border-t pt-6 overflow-hidden bg-gray-100">
          {/* APP DOWNLOAD SECTION */}
          <div className="md:col-span-2 lg:col-span-4 w-[100%] text-center">
            {/* SOCIAL ICONS */}
            <h3 className="font-bold mb-2">FOLLOW US</h3>
            <div className="flex mb-4 w-full justify-evenly">
              <Link to="#" className="bg-gray-700 p-1 rounded-sm">
                <FaFacebook size={30} className="text-white" />
              </Link>
              <Link to="#" className="bg-gray-700 p-1 rounded-sm">
                <FaInstagram size={30} className="text-white" />
              </Link>
              <Link to="#" className="bg-gray-700 p-1 rounded-sm">
                <FaTwitter size={30} className="text-white" />
              </Link>
              <Link to="#" className="bg-gray-700 p-1 rounded-sm">
                <FaYoutube size={30} className="text-white" />
              </Link>
            </div>

            {/* INPUT BOXES */}
            <h3 className="font-bold mb-2 text-left">SPORT ADVICE FOR YOU</h3>
            <input
              type="text"
              placeholder="blog.sportswear9.in"
              className="w-full max-w-full border border-gray-300 bg-white text-center rounded-md px-3 py-2 mb-4"
            />

            <h3 className="font-bold mb-2 text-left">
              EXPLORE SPORTS EVENTS NEAR YOU
            </h3>
            <input
              type="text"
              placeholder="play.sportswear9.in"
              className="w-full max-w-full border border-gray-300 bg-white text-center rounded-md px-3 py-2 mb-2"
            />
          </div>
        </div>
      </div>

      {/* === PAYMENT STRIP === */}
      <div className="bg-gray-100 py-4 border-t overflow-hidden">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between px-4 gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold">🔒 100% SECURE TRANSACTION</span>
            <span>Secure SSL encryption</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
              className="h-6"
              alt="Visa"
            />
            <img
              src="data:image/png;base64,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"
              className="h-6"
              alt="Mastercard"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/RuPay.svg/2560px-RuPay.svg.png"
              className="h-6"
              alt="RuPay"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/2560px-UPI-Logo-vector.svg.png"
              className="h-6"
              alt="UPI"
            />
            <img
              src="https://img.favpng.com/9/20/1/online-banking-logo-organization-clip-art-png-favpng-U3WiXXaBFvJuipxBfZ9camEjB.jpg"
              className="h-6"
              alt="Netbanking"
            />
          </div>
        </div>
      </div>

      {/* === COPYRIGHT === */}
      <div className="text-center text-xs py-4 border-t mb-20 lg:mb-0 overflow-hidden">
        © 2025 Sportswear9. All rights reserved.
      </div>
    </footer>
    </>
  );
};

export default Footer;
