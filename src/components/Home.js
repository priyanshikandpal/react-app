import React, { useState } from "react";
import welcomeImg from "./assets/welcome.svg";

function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-pink-50 to-purple-100 relative">
      {/* Sidebar Drawer */}
      <div
        className={`fixed top-0 left-0 h-full z-40 transition-transform duration-300 bg-white/90 shadow-2xl w-72 border-r border-pink-100
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          {/* Fun message */}
          <div className="p-8 flex-1 flex flex-col justify-center items-center">
            <span className="text-5xl mb-4 animate-bounce">😄</span>
            <h3 className="text-2xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-500 text-center">
              Hey there, Awesome Human!
            </h3>
            <p className="text-blue-700 text-center mb-4">
              Welcome to a place where your notes get superpowers.<br />
              <span className="font-semibold text-pink-500">Smile,</span> you’re about to make something amazing!
            </p>
            <span className="inline-block mt-2 text-xs text-gray-400">P.S. You look great today! 🌟</span>
          </div>
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-3xl font-bold text-gray-400 hover:text-pink-500 transition"
            onClick={() => setSidebarOpen(false)}
            title="Close sidebar"
          >
            &times;
          </button>
        </div>
      </div>

      {/* Overlay when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 bg-gradient-to-br from-blue-600 to-pink-500 text-white rounded-full p-3 shadow-xl hover:scale-110 transition-transform focus:outline-none"
        onClick={() => setSidebarOpen(true)}
        style={{ display: sidebarOpen ? "none" : "block" }}
        title="Open sidebar"
      >
        {/* Hamburger icon */}
        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 8h20M4 14h20M4 20h20" />
        </svg>
      </button>

      {/* Main Home Content */}
      <div className="flex-1 flex flex-col items-center justify-center z-10">
        <div className="bg-white/90 rounded-3xl shadow-2xl p-10 max-w-lg w-full text-center border border-pink-100 mt-20">
          <img
            src={welcomeImg}
            alt="Welcome"
            className="w-40 mx-auto mb-6 drop-shadow-lg"
          />
          <h2 className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-500">
            Welcome!
          </h2>
          <h3 className="text-xl font-semibold mb-4 text-blue-800">
            User Form Application
          </h3>
          <p className="text-gray-600 mb-6 text-lg">
            A beautiful React + PHP app for user management and rich notes.
          </p>
          <a
            href="/form"
            className="inline-block mt-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-pink-500 text-white text-lg rounded-xl font-bold shadow-lg hover:scale-105 transition-transform"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
}

export default Home;
