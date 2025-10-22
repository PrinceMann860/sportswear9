import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Error404Page = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState([]);
  const [glitchEffect, setGlitchEffect] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 15 : 25;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      size: Math.random() * (isMobile ? 4 : 6) + 2,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 8,
      color: Math.random() > 0.8 ? "bg-blue-500" : "bg-gray-800",
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 100);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 relative overflow-hidden mt-[60px] lg:mt-[80px] p-4 sm:p-6 lg:p-10">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-10 md:opacity-20">
          <div className="grid grid-cols-10 md:grid-cols-20 gap-1 md:gap-2 h-full w-full">
            {Array.from({ length: window.innerWidth < 768 ? 100 : 400 }).map(
              (_, i) => (
                <div
                  key={i}
                  className="border border-gray-300 animate-pulse"
                  style={{
                    animationDelay: `${(i % 10) * 0.1}s`,
                    animationDuration: `${3 + (i % 5)}s`,
                  }}
                />
              )
            )}
          </div>
        </div>

        {/* Floating shapes */}
        <div
          className="absolute top-1/4 -left-10 md:-left-20 w-32 h-32 md:w-64 md:h-64 bg-blue-500 rounded-full opacity-5 animate-float"
          style={{ animationDuration: "15s" }}
        />
        <div
          className="absolute bottom-1/4 -right-10 md:-right-20 w-40 h-40 md:w-80 md:h-80 bg-gray-800 rounded-full opacity-5 animate-float"
          style={{ animationDuration: "20s", animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/6 md:left-1/4 w-24 h-24 md:w-48 md:h-48 bg-gray-600 rounded-lg opacity-5 rotate-45 animate-float"
          style={{ animationDuration: "18s", animationDelay: "1s" }}
        />

        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute rounded-full ${particle.color} opacity-20 md:opacity-30 animate-float`}
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Main Layout */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-2 sm:px-4 lg:px-8">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
          
          {/* ✅ 404 Section - TOP ON MOBILE */}
          <div className="relative order-1 lg:order-1">
            <div className={`relative ${glitchEffect ? "glitch-active" : ""}`}>
              <div className="text-center lg:text-left mb-6 md:mb-8">
                <h1 className="text-7xl xs:text-8xl sm:text-9xl lg:text-10xl font-black tracking-tighter leading-none">
                  <span className="block text-gray-900 relative">
                    <span className="absolute -inset-2 md:-inset-4 bg-blue-500 opacity-0 blur-lg animate-pulse-glitch"></span>
                    404
                  </span>
                </h1>

                <div className="relative mt-6 md:mt-8 w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 mx-auto lg:mx-0">
                  <div className="absolute inset-0 border-4 md:border-8 border-gray-300 rounded-full animate-ping-slow"></div>
                  <div className="absolute inset-4 md:inset-8 border-2 md:border-4 border-blue-500 rounded-full animate-spin-slow"></div>
                  <div className="absolute inset-8 md:inset-16 bg-gray-900 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ✅ Content Section - BELOW ON MOBILE */}
          <div className="space-y-6 md:space-y-8 order-2 lg:order-1">
            <div className="space-y-4 md:space-y-6">
              <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                You Missed the <span className="text-blue-500">Target</span>
              </h2>

              <div className="space-y-3 md:space-y-4">
                <p className="text-lg xs:text-xl sm:text-2xl text-gray-700 font-medium">
                  This page didn't make the cut — but you still can.
                </p>

                <p className="text-base xs:text-lg md:text-lg text-gray-600 leading-relaxed">
                  Whether you were hunting for gear, gains, or greatness… this
                  isn't it. Let's get you back in action where the real work
                  happens.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-6 py-4 md:py-6">
              <div className="text-center p-3 md:p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="text-xl xs:text-2xl md:text-3xl font-bold text-gray-900">
                  100%
                </div>
                <div className="text-xs xs:text-sm text-gray-600 mt-1">
                  Commitment
                </div>
              </div>
              <div className="text-center p-3 md:p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="text-xl xs:text-2xl md:text-3xl font-bold text-gray-900">
                  0 Excuses
                </div>
                <div className="text-xs xs:text-sm text-gray-600 mt-1">
                  No Limits
                </div>
              </div>
            </div>

            <div className="flex flex-col xs:flex-row gap-3 md:gap-4 pt-4 md:pt-6">
              <Link to={"/"} className="flex-1">
                <button
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="group relative w-full px-4 xs:px-6 md:px-8 py-3 md:py-4 bg-gray-900 text-white rounded-lg md:rounded-xl font-bold text-base md:text-lg transition-all duration-300 transform hover:scale-105 hover:bg-blue-500 hover:shadow-2xl hover:shadow-blue-500/30 overflow-hidden flex items-center justify-center"
                >
                  <span className="relative z-10 flex items-center">
                    Return Home
                    <svg
                      className="ml-2 w-4 h-4 md:w-5 md:h-5 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 transform ${
                      isHovered ? "translate-x-0" : "-translate-x-full"
                    } transition-transform duration-300 ease-out`}
                  />
                </button>
              </Link>
              <Link to={"/contact"} className="flex-1">
                <button className="w-full px-4 xs:px-6 md:px-8 py-3 md:py-4 border-2 border-gray-800 text-gray-900 rounded-lg md:rounded-xl font-bold text-base md:text-lg transition-all duration-300 transform hover:scale-105 hover:bg-gray-800 hover:text-white hover:shadow-xl flex items-center justify-center">
                  Get Help
                  <svg
                    className="ml-2 w-4 h-4 md:w-5 md:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorations */}
      <div className="absolute bottom-0 left-0 right-0 h-10 md:h-20 bg-gradient-to-t from-gray-900/10 to-transparent"></div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }
        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          75%,
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
        @keyframes pulse-glitch {
          0%,
          100% {
            opacity: 0;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.1);
          }
        }
        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .glitch-active {
          animation: glitch 0.1s linear;
        }
        @keyframes glitch {
          0% {
            transform: translate(0);
          }
          20% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(2px, -2px);
          }
          60% {
            transform: translate(-2px, 2px);
          }
          80% {
            transform: translate(2px, 2px);
          }
          100% {
            transform: translate(0);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animate-pulse-glitch {
          animation: pulse-glitch 2s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        .text-10xl {
          font-size: 12rem;
          line-height: 1;
        }
        @media (max-width: 475px) {
          .text-10xl {
            font-size: 8rem;
          }
        }
        .grid-cols-20 {
          grid-template-columns: repeat(20, minmax(0, 1fr));
        }
      `}</style>
    </div>
  );
};

export default Error404Page;
