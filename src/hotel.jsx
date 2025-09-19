import React, { useState } from 'react';
import { getAccessToken, getHotelOffers } from './api/amadeusapi';

const CITY_COORDINATES = {
  "New York": { latitude: "40.7128", longitude: "-74.0060" },
  Paris: { latitude: "48.864716", longitude: "2.349014" },
  London: { latitude: "51.5074", longitude: "-0.1278" }
};

const PREFILL_CITY = "New York";

const MOCK_HOTEL_DATA = [
  {
    name: "Mock Hotel One",
    address: { lines: ["123 Sample St", "City"] },
    rating: 4.5,
    price: { total: "120", currency: "USD" }
  },
  {
    name: "Mock Hotel Two",
    address: { lines: ["456 Example Rd", "City"] },
    rating: 3.8,
    price: { total: "100", currency: "USD" }
  }
];

const Hotel = () => {
  const [city, setCity] = useState(PREFILL_CITY);
  const [checkInDate, setCheckInDate] = useState(new Date().toISOString().split("T")[0]);
  const [checkOutDate, setCheckOutDate] = useState(
    new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString().split("T")[0]
  );
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchHotels = async () => {
    setError(null);
    setLoading(true);
    setHotels([]);

    const coords = CITY_COORDINATES[city];
    if (!coords) {
      setError("City not supported. Try New York, Paris, or London.");
      setLoading(false);
      setHotels(MOCK_HOTEL_DATA);
      return;
    }

    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Failed to get access token");

      const queryParams = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        checkInDate,
        checkOutDate,
        roomQuantity: "1",
        adults: "1"
      };

      const data = await getHotelOffers(token, queryParams);
      console.log("Amadeus API hotel search response:", data);

      if (!data || data.length === 0) {
        setError("No hotels found from API, showing mock data.");
        setHotels(MOCK_HOTEL_DATA);
      } else {
        setHotels(data);
      }
    } catch (err) {
      setError(err.message || "Error fetching hotels from API, showing mock data.");
      setHotels(MOCK_HOTEL_DATA);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    searchHotels();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-xl font-bold text-center mb-6">Hotel Search</h2>

      <div className="flex gap-4 justify-center flex-wrap mb-6">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city (New York, Paris, London)"
          className="border rounded p-2 w-48"
        />
        <input
          type="date"
          value={checkInDate}
          onChange={(e) => setCheckInDate(e.target.value)}
          className="border rounded p-2 w-44"
        />
        <input
          type="date"
          value={checkOutDate}
          onChange={(e) => setCheckOutDate(e.target.value)}
          className="border rounded p-2 w-44"
        />
        <button
          onClick={searchHotels}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 rounded"
        >
          Search
        </button>
      </div>

      {loading && <p className="text-center mb-4">Loading hotels...</p>}
      {error && <p className="text-center text-red-600 mb-4">{error}</p>}

      {hotels.length > 0 &&
        hotels.map((hotel, idx) => {
          // Adapt mock data to same structure for display
          const name = hotel.hotel?.name || hotel.name;
          const address =
            hotel.hotel?.address?.lines?.join(", ") || hotel.address?.lines?.join(", ") || "Address N/A";
          const rating = hotel.hotel?.rating ?? hotel.rating ?? "N/A";
          const price = hotel.offers?.[0]?.price?.total || hotel.price?.total || "N/A";
          const currency = hotel.offers?.[0]?.price?.currency || hotel.price?.currency || "";

          return (
            <div key={idx} className="border rounded p-4 mb-4 shadow">
              <h3 className="text-lg font-semibold mb-2">{name}</h3>
              <p className="mb-1">{address}</p>
              <p className="mb-1">Rating: {rating}</p>
              <p className="mb-1">
                Price: {price} {currency}
              </p>
            </div>
          );
        })}
    </div>
  );
};

export default Hotel;
