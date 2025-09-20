import React, { useState, useEffect } from 'react';

const sampleTrains = [
  {
    aimed_departure_time: "10:30",
    expected_departure_time: "10:32",
    destination_name: "Cambridge",
    platform: "4",
    status: "On time"
  },
  {
    aimed_departure_time: "11:00",
    expected_departure_time: "11:05",
    destination_name: "Peterborough",
    platform: "2",
    status: "Delayed"
  },
  {
    aimed_departure_time: "11:30",
    expected_departure_time: "On time",
    destination_name: "Norwich",
    platform: "1",
    status: "On time"
  }
];

const Train = () => {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stationCode, setStationCode] = useState("KGX"); // King's Cross default

  const appId = import.meta.env.VITE_TRANSPORT_API_APP_ID;
  const appKey = import.meta.env.VITE_TRANSPORT_API_APP_KEY;

  useEffect(() => {
    const fetchTrains = async () => {
      if (stationCode.length !== 3) {
        setError("Station code must be exactly 3 letters.");
        setTrains([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://transportapi.com/v3/uk/train/station/${stationCode}/live.json?app_id=${appId}&app_key=${appKey}&darwin=false&train_status=passenger`
        );

        if (!response.ok) {
          const text = await response.text();
          console.error("Train API response error:", text);
          throw new Error(`Failed to fetch train data (Status: ${response.status})`);
        }

        const data = await response.json();

        if (data.departures && data.departures.all && data.departures.all.length > 0) {
          setTrains(data.departures.all);
        } else {
          setError(null);
          setTrains(sampleTrains);
        }
      } catch (err) {
        console.error(err);
        setError("Problem fetching data from the API. Please check API keys or network.");
        setTrains(sampleTrains);
      }
      setLoading(false);
    };

    if (!appId || !appKey) {
      setError("API credentials missing. Set VITE_TRANSPORT_API_APP_ID and VITE_TRANSPORT_API_APP_KEY in .env");
      setLoading(false);
      setTrains(sampleTrains);
      return;
    }

    fetchTrains();
  }, [stationCode, appId, appKey]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-center font-bold text-2xl mb-2">Train Departures - UK Station: {stationCode}</h2>
      <p className="text-center text-sm text-gray-600 mb-4">* Data available only for UK train stations</p>

      <div className="mb-6 flex justify-center">
        <input
          type="text"
          value={stationCode}
          onChange={(e) => setStationCode(e.target.value.toUpperCase())}
          placeholder="Station Code (e.g. KGX)"
          className="border rounded p-2 w-40 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
          maxLength={3}
        />
      </div>

      {loading && <p className="text-center text-gray-700">Loading train data...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {trains.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-3 py-2">Scheduled</th>
                <th className="border px-3 py-2">Expected</th>
                <th className="border px-3 py-2">Destination</th>
                <th className="border px-3 py-2">Platform</th>
                <th className="border px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {trains.map((train, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="border px-3 py-2">{train.aimed_departure_time}</td>
                  <td className="border px-3 py-2">{train.expected_departure_time}</td>
                  <td className="border px-3 py-2">{train.destination_name}</td>
                  <td className="border px-3 py-2">{train.platform}</td>
                  <td className="border px-3 py-2">{train.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Train;
