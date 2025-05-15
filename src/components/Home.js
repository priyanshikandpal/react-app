import React from "react";
import welcomeImg from "./assets/welcome.svg";

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">

        <img
        src={welcomeImg}
        alt="Welcome"
        className="w-32 mx-auto mb-4"
      />
        <h2 className="text-2xl font-bold mb-4">
          Welcome to the User Form Application
        </h2>
        <p className="text-gray-600 mb-4">
          This is a simple React + PHP application with styled UI.
        </p>
        
        <a
          href="/form"
          className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
        >
          Get Started
        </a>
      </div>
    </div>
  );
}

export default Home;
