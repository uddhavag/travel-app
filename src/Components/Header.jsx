import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-gray-200 p-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold">Travel</h1>
        <nav className="flex gap-6 font-semibold">
          <Link to="/" className="hover:underline">
            Flights
          </Link>
          <Link to="/train" className="hover:underline">
            Trains
          </Link>
          <Link to="/hotel" className="hover:underline">
            Hotels
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
    