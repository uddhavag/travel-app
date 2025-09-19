Travel Booking Web App
This web application allows users to search and book flights, trains, and hotels with seamless integration of travel services.

Features
Flight search and booking capabilities

Train schedule and status lookups

Hotel search and booking through Amadeus API

Train data using Transport API

User-friendly interface with React and Tailwind CSS

Secure API key management through environment variables

Technologies Used
React (with hooks)

Tailwind CSS for styling

Amadeus Self-Service API for flight and hotel data and booking

Transport API (UK) for train information

Vite as the frontend build tool

API Integration Details
Amadeus API
Used for hotel and flight search and booking.

Requires API key and secret from Amadeus for Developers.

API keys are stored securely in environment variables:

VITE_AMADEUS_CLIENT_ID

VITE_AMADEUS_CLIENT_SECRET

Authentication utilizes OAuth 2.0 client credentials flow.

Endpoints used include /v2/shopping/hotel-offers and /v2/shopping/flight-offers.

Booking endpoint /v1/booking/hotel-bookings is used to create hotel reservations.

Transport API
Used for real-time train departure data in the UK.

Requires app ID and app key from TransportAPI.

API keys are stored in environment variables: