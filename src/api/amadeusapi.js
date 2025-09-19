const AMADEUS_OAUTH_URL = "https://test.api.amadeus.com/v1/security/oauth2/token";
const AMADEUS_FLIGHT_OFFERS_URL = "https://test.api.amadeus.com/v2/shopping/flight-offers";
const AMADEUS_HOTEL_OFFERS_URL = "https://test.api.amadeus.com/v2/shopping/hotel-offers";
const AMADEUS_HOTEL_BOOKING_URL = "https://test.api.amadeus.com/v1/booking/hotel-bookings";

async function getAccessToken() {
  const clientId = import.meta.env.VITE_AMADEUS_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_AMADEUS_CLIENT_SECRET;

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);

  try {
    const response = await fetch(AMADEUS_OAUTH_URL, {
      method: "POST",
      body: params,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get access token");
    }

    const data = await response.json();
    return data.access_token;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function getFlightOffers(accessToken, queryParams) {
  const urlParams = new URLSearchParams(queryParams);

  try {
    const response = await fetch(`${AMADEUS_FLIGHT_OFFERS_URL}?${urlParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get flight offers");
    }

    const data = await response.json();
    return data.data || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function getHotelOffers(accessToken, queryParams) {
  const urlParams = new URLSearchParams(queryParams);

  try {
    const response = await fetch(`${AMADEUS_HOTEL_OFFERS_URL}?${urlParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get hotel offers");
    }

    const data = await response.json();
    return data.data || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function createHotelOrder(accessToken, orderData) {
  try {
    const response = await fetch(AMADEUS_HOTEL_BOOKING_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create order: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export { getAccessToken, getFlightOffers, getHotelOffers, createHotelOrder };
