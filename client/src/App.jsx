import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Search from "./components/Search";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Main content */}
      <div className="flex flex-col items-center justify-center flex-grow p-4">
        <div className="flex gap-4 mb-8">
          <img
            src={reactLogo}
            className="w-24 h-24 animate-spin-slow"
            alt="React logo"
          />
          <img src={viteLogo} className="w-24 h-24" alt="Vite logo" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8">
          Vite + React
        </h1>
      </div>

      {/* Search component */}
      <div className="p-4">
        <Search />
      </div>
    </div>
  );
}

export default App;
