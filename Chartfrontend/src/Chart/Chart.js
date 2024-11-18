import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Chart = () => {
  const [chartData, setChartData] = useState([]);
  const [algoStatus, setAlgoStatus] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // Fetch logs from the API
        const response = await fetch(
          "http://localhost:8003/api/v1/log/logsALL"
        );
        const data = await response.json();
        const logsinfo = data.logs || [];

        // Retrieve logged-in user's data from localStorage
        const userData = JSON.parse(localStorage.getItem("userData"));
        const loggedInEmployeeName = userData?.firstname;

        console.log("API Logs:", logsinfo);
        console.log("Logged-in user name:", loggedInEmployeeName);

        // Filter logs based on employee name
        const filteredLogs = logsinfo.filter(
          (log) => log.employee_name === loggedInEmployeeName
        );

        console.log("Filtered logs for user:", filteredLogs);

        // Set the filtered logs state
        setFilteredLogs(filteredLogs);

        // Filter and map algo_status
        if (Array.isArray(filteredLogs)) {
          const filteredAlgoStatus = filteredLogs
            .filter((log) => log.algo_status !== undefined)
            .map((log) =>
              log.algo_status === "Energy Saving Mode ON"
                ? 1
                : log.algo_status === "Energy Saving Mode OFF"
                ? 0
                : null
            )
            .filter((status) => status !== null);

          console.log(
            "Filtered and mapped algo_status values:",
            filteredAlgoStatus
          );
          setAlgoStatus(filteredAlgoStatus);
        }

        // Assuming storedData is already available in localStorage
        const storedData = JSON.parse(localStorage.getItem("chartData")) || [];

        // Format the data for the chart
        const formattedData = storedData.map((item) => {
          const date = new Date(item.createdAt);
          const formattedDate = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          return {
            date: formattedDate,
            onMode: item.total_kwh,
            offMode: 0,
          };
        });

        // Set the chart data state
        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false); // Hide loading spinner once data is fetched
      }
    };

    fetchLogs();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading message or spinner
  }

  return (
    <div className="h-full p-4">
      <h1 className="mb-4 text-2xl font-bold">Energy Consumption Chart</h1>

      {/* Energy Consumption Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis
            label={{
              value: "Energy Consumed (kWh)",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="onMode" name="Energy Consumption" fill="#2078d6" />
        </BarChart>
      </ResponsiveContainer>

      {/* Display logs for the logged-in user */}
      <div className="mt-6">
        <h2 className="mb-4 text-xl font-semibold">User Logs</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredLogs && filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <div
                key={log._id}
                className="p-4 bg-white border border-gray-200 rounded-lg shadow-md"
              >
                <h3 className="text-lg font-semibold text-blue-600">
                  {log.employee_name}
                </h3>
                <p className="text-sm text-gray-600">Time: {log.access_time}</p>
                <p className="text-sm text-gray-600">
                  Date: {new Date(log.access_date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  Status: {log.algo_status}
                </p>
              </div>
            ))
          ) : (
            <p>No logs found for this user.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chart;
