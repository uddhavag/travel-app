import React, { useState } from 'react';
import { getAccessToken, getFlightOffers } from './api/amadeusapi';

const Flight = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [flightOffers, setFlightOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const fetchFlightData = async (originCode, destinationCode, departDate) => {
    if (!originCode || !destinationCode || !departDate) {
      setError("Please fill all search fields.");
      setFlightOffers([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const accessToken = await getAccessToken();
      if (!accessToken) throw new Error("Could not get access token");

      const queryParams = {
        originLocationCode: originCode,
        destinationLocationCode: destinationCode,
        departureDate: departDate,
        adults: 1,
        nonStop: 'false',
        currencyCode: 'INR',
        max: 10,
      };

      const offers = await getFlightOffers(accessToken, queryParams);
      setFlightOffers(offers);
      if (offers.length === 0) {
        setError("No flight offers found for the specified route and date.");
      }
    } catch (err) {
      setError(err.message || "Error fetching flight offers");
      setFlightOffers([]);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFlightData(origin, destination, departureDate);
  };

  const getAirlineLogoUrl = (carrierCode) => {
    const airlineDomains = {
      AI: 'airindia.in',
      SG: 'spicejet.com',
      '6E': 'indigo.com',
      UK: 'vistaraairways.com',
      IX: 'airindiaexpress.in',
    };
    const domain = airlineDomains[carrierCode] || null;
    if (domain) {
      return `https://logo.clearbit.com/${domain}`;
    }
    return 'https://via.placeholder.com/40?text=?';
  };

  const getAirlineName = (carrierCode) => {
    const airlineNames = {
      AI: 'Air India',
      SG: 'SpiceJet',
      '6E': 'IndiGo',
      UK: 'Vistara',
      IX: 'Air India Express',
    };
    return airlineNames[carrierCode] || carrierCode;
  };

  const formatTime = (iso) => {
    const date = new Date(iso);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white text-gray-900 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-center">Flight Search</h1>

      <form onSubmit={handleSearch} className="flex flex-wrap items-end gap-4 justify-center mb-8">
        <div className="flex flex-col">
          <label htmlFor="origin" className="mb-1 font-semibold text-gray-800">From Place</label>
          <input
            id="origin"
            className="border rounded px-4 py-2 w-48 text-center uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value.toUpperCase())}
            placeholder="Enter From Place (e.g. DEL)"
            required
            maxLength={3}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="destination" className="mb-1 font-semibold text-gray-800">To Destination</label>
          <input
            id="destination"
            className="border rounded px-4 py-2 w-48 text-center uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value.toUpperCase())}
            placeholder="Enter To Destination (e.g. BLR)"
            required
            maxLength={3}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="departureDate" className="mb-1 font-semibold text-gray-800">Departure Date</label>
          <input
            id="departureDate"
            className="border rounded px-4 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition"
        >
          Search
        </button>
      </form>

      {loading && <p className="text-center text-gray-700">Loading flight offers...</p>}
      {error && <p className="text-center text-red-600 font-semibold">{error}</p>}
      {!loading && !error && flightOffers.length === 0 && (
        <p className="text-center text-gray-700">No flight offers found. Please try different criteria.</p>
      )}

      <div className="space-y-1" role="list" aria-live="polite">
        {flightOffers.map((offer, index) => {
          const itinerary = offer.itineraries[0];
          const segments = itinerary.segments;
          const segment = segments[0];
          const lastSegment = segments[segments.length - 1];
          const isExpanded = expandedIndex === index;

          return (
            <div key={index}>
              <article
                className={`flex items-center justify-between border rounded-lg shadow transition-colors ${
                  isExpanded ? 'bg-gray-100' : 'bg-white'
                } p-4`}
                aria-expanded={isExpanded}
                role="listitem"
              >
                <div className="flex items-center space-x-4 w-full">
                  <img
                    src={getAirlineLogoUrl(segment.carrierCode)}
                    alt={`${segment.carrierCode} logo`}
                    className="w-14 h-14 rounded-md bg-gray-200 object-contain"
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/56?text=?')}
                  />
                  <div className="flex flex-col flex-1 min-w-0 ml-4 text-gray-900">
                    <span className="text-lg font-bold">
                      {formatTime(segment.departure.at)} – {formatTime(lastSegment.arrival.at)}
                    </span>
                    <span>{getAirlineName(segment.carrierCode)}</span>
                    <p className="mt-1 text-gray-600">
                      {segment.departure.iataCode} → {lastSegment.arrival.iataCode}
                    </p>
                    <p className="text-gray-600">
                      Duration: {itinerary.duration.replace('PT', '').toLowerCase()} | Stops: {segments.length - 1}
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-between h-full min-w-max ml-2">
                    <span className="text-green-600 text-xl font-bold">
                      {offer.price.currency} {offer.price.total}
                    </span>
                    <button
                      onClick={() => setExpandedIndex(isExpanded ? null : index)}
                      className="mt-2 px-3 py-1 rounded hover:bg-blue-100 text-blue-700 text-sm font-semibold"
                      aria-controls={`details-${index}`}
                      aria-label={isExpanded ? 'Show less details' : 'Show more details'}
                    >
                      {isExpanded ? 'Show Less' : 'More Info'}
                    </button>
                  </div>
                </div>
              </article>

              {isExpanded && (
                <div
                  className="border rounded-b-lg bg-gray-50 px-4 py-3 mb-4 shadow-md text-gray-800"
                  id={`details-${index}`}
                  aria-live="polite"
                >
                  {segments.map((seg, idx) => (
                    <div key={idx} className="border border-gray-300 p-3 rounded-md mb-2 bg-white shadow-sm">
                      <p>
                        <strong>Flight Number:</strong> {seg.carrierCode} {seg.number}
                      </p>
                      <p>
                        <strong>Segment {idx + 1}:</strong> {seg.departure.iataCode} at{' '}
                        {new Date(seg.departure.at).toLocaleString()} → {seg.arrival.iataCode} at{' '}
                        {new Date(seg.arrival.at).toLocaleString()}
                      </p>
                      <p>Aircraft Code: {seg.aircraft?.code || 'N/A'}</p>
                      <p>Operating Carrier: {seg.operating?.carrierCode || 'N/A'}</p>
                    </div>
                  ))}
                  <p><strong>Stops:</strong> {segments.length - 1}</p>
                  <p><strong>Fare Type:</strong> {offer.pricingOptions?.fareType || 'N/A'}</p>
                  <p><strong>Bookable Seats:</strong> {offer.numberOfBookableSeats}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Flight;
