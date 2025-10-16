import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
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
"Women Winter Collection : Women Sweaters | Women Fleece Jacket | Women Pullover | Women Sweatshirt | Women Jackets | Women Winter Jacket | Women Puffer Jacket | Women Down Jacket | Women Snow Jacket | Women Bomber Jacket | Women Snow Shoes | Women Winter Outfits | Women Thermals | Women Warm Trouser | "
          ].map((row, idx) => (
            <p key={idx} className="w-full break-words overflow-hidden">
              {row.split("|").map((link, i) => (
                <a key={i} href="#" className="hover:underline inline break-words">
                  {link.trim()}{" "}
                </a>
              ))}
            </p>
          ))}
        </div>
      </div>

      {/* === PROMISE STRIP === */}
      <div className="bg-gray-100 py-4 border-b overflow-hidden">
        <div className="max-w-[1400px] mx-auto flex flex-wrap justify-between items-center text-center px-4 gap-4">
          <div className="flex items-center gap-2 text-sm"><span>🏅</span> <span>Our Promise</span></div>
          <div className="flex items-center gap-2 text-sm"><span>💳</span> <span>No Cost EMI Available*</span></div>
          <div className="flex items-center gap-2 text-sm"><span>↩️</span> <span>Easy Returns*</span></div>
          <div className="flex items-center gap-2 text-sm"><span>😊</span> <span>1 million+ happy Customers</span></div>
        </div>
      </div>

      {/* === LOWER FOOTER SECTIONS === */}
      <div className="lg:flex overflow-hidden">
        <div className="w-full lg:w-[80%] mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">

          {/* SUPPORT */}
          <div className="ml-2 md:ml-5 lg:ml-10">
            <h3 className="font-bold mb-2">SUPPORT</h3>
            <a href="#" className="block hover:underline">Contact our Stores</a>
            <a href="#" className="block hover:underline">Delivery</a>
          </div>

          {/* OUR SERVICES */}
          <div>
            <h3 className="font-bold mb-2">OUR SERVICES</h3>
            {[
              "Decathlon for Schools",
              "Decathlon for Corporates",
              "Decathlon for Sport Clubs",
              "Decathlon Gift Cards",
              "Affiliate Program",
              "Decathlon Second Life",
              "Decathlon Buy Back",
              "Installation & Assembly Services"
            ].map((item, i) => (
              <a key={i} href="#" className="block hover:underline">{item}</a>
            ))}
          </div>

          {/* ABOUT US */}
          <div>
            <h3 className="font-bold mb-2">ABOUT US</h3>
            {["Careers","News from Decathlon India","Social Initiatives"].map((item, i) => (
              <a key={i} href="#" className="block hover:underline">{item}</a>
            ))}
          </div>

          {/* LEGAL */}
          <div>
            <h3 className="font-bold mb-2">LEGAL</h3>
            <a href="#" className="block hover:underline">Return Policy</a>
            <a href="#" className="block hover:underline">Terms and Conditions</a>
            <a href="#" className="block hover:underline">Privacy Policy</a>
          </div>
        </div>

        {/* === RIGHT SIDE SECTION (APP + SOCIAL + INPUTS) === */}
        <div className="w-full lg:w-[20%] mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6 border-t pt-6 overflow-hidden">  
          {/* APP DOWNLOAD SECTION */}
          <div className="md:col-span-2 w-full">

            {/* SOCIAL ICONS */}
            <h3 className="font-bold mb-2">FOLLOW US</h3>
            <div className="flex gap-4 mb-4">
              <a href="#"><FaFacebook  size={30}/></a>
              <a href="#"><FaInstagram  size={30}/></a>
              <a href="#"><FaTwitter  size={30}/></a>
              <a href="#"><FaYoutube  size={30}/></a>
            </div>

            {/* INPUT BOXES */}
            <h3 className="font-bold mb-2">SPORT ADVICE FOR YOU</h3>
            <input
              type="text"
              placeholder="blog.decathlon.in"
              className="w-full max-w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
            />

            <h3 className="font-bold mb-2">EXPLORE SPORTS EVENTS NEAR YOU</h3>
            <input
              type="text"
              placeholder="play.decathlon.in"
              className="w-full max-w-full border border-gray-300 rounded-md px-3 py-2"
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
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" className="h-6" alt="Visa" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/0f/Mastercard-logo.png" className="h-6" alt="Mastercard" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5a/RuPay.svg" className="h-6" alt="RuPay" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/UPI-Logo-vector.svg" className="h-6" alt="UPI" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a0/Netbanking_logo.png" className="h-6" alt="Netbanking" />
          </div>
        </div>
      </div>

      {/* === COPYRIGHT === */}
      <div className="text-center text-xs py-4 border-t mb-20 overflow-hidden">
        © 2025 Sportswear9. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;