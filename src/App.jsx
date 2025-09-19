import React from 'react'
import { Routes, Route, Link } from 'react-router-dom';
import Flight from './flight';
import Train from './train';
import Hotel from './hotel';
import Header from './Components/Header';
import Footer from './Components/Footer';

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Flight />} />
        <Route path="/train" element={<Train />} />
        <Route path="/hotel" element={<Hotel />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App