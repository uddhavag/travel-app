import React, { useState, useEffect } from 'react';

const Train = () => {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stationCode, setStationCode] = useState("KGX"); // King's Cross default

  const appId = import.meta.env.VITE_TRANSPORT_API_APP_ID;
  const appKey = import.meta.env.VITE_TRANSPORT_API_APP_KEY;

  useEffect(() => {
    const fetchTrains = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://transportapi.com/v3/uk/train/station/${stationCode}/live.json?app_id=${appId}&app_key=${appKey}&darwin=false&train_status=passenger`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch train data");
        }

        const data = await response.json();

        if (data.departures && data.departures.all) {
          setTrains(data.departures.all);
        } else {
          setError("No train data found");
        }
      } catch (err) {
        setError(err.message);
      }

      setLoading(false);
    };

    if (appId && appKey) {
      fetchTrains();
    } else {
      setError("API credentials missing. Set VITE_TRANSPORT_API_APP_ID and VITE_TRANSPORT_API_APP_KEY in .env");
      setLoading(false);
    }
  }, [stationCode, appId, appKey]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-center font-bold text-2xl mb-4">Train Departures - Station {stationCode}</h2>

      <div className="mb-4">
        <input
          type="text"
          value={stationCode}
          onChange={(e) => setStationCode(e.target.value.toUpperCase())}
          placeholder="Station Code (e.g KGX)"
          className="border rounded p-2 w-40"
        />
      </div>

      {loading && <p>Loading train data...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {trains.length > 0 && (
        <table className="w-full text-left border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1">Scheduled</th>
              <th className="border px-2 py-1">Expected</th>
              <th className="border px-2 py-1">Destination</th>
              <th className="border px-2 py-1">Platform</th>
              <th className="border px-2 py-1">Status</th>
            </tr>
          </thead>
          <tbody>
            {trains.map((train, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="border px-2 py-1">{train.aimed_departure_time}</td>
                <td className="border px-2 py-1">{train.expected_departure_time}</td>
                <td className="border px-2 py-1">{train.destination_name}</td>
                <td className="border px-2 py-1">{train.platform}</td>
                <td className="border px-2 py-1">{train.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Train;
