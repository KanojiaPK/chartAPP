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
import apiUrl from "../utils/apiURL";

const Chart = () => {
  const [chartData, setChartData] = useState([]);
  const [algoStatus, setAlgoStatus] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc"); // State for sorting order
  const [startDate, setStartDate] = useState(""); // Start date for filtering
  const [endDate, setEndDate] = useState(""); // End date for filtering
  const [filteredChartData, setFilteredChartData] = useState([]); // Chart data after filtering

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // Fetch logs from the API
        const response = await fetch(`${apiUrl}/api/v1/log/logsALL`);
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
        setFilteredChartData(formattedData); // Initially display all chart data
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false); // Hide loading spinner once data is fetched
      }
    };

    fetchLogs();
  }, []);

  // Function to sort logs by access_time
  const sortLogs = (order) => {
    const sortedLogs = [...filteredLogs].sort((a, b) => {
      const timeA = new Date(`1970-01-01T${a.access_time}`).getTime();
      const timeB = new Date(`1970-01-01T${b.access_time}`).getTime();
      return order === "asc" ? timeA - timeB : timeB - timeA;
    });
    setFilteredLogs(sortedLogs);
    setSortOrder(order);
  };

  // Function to filter chart data by date range
  const filterChartData = () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    const filteredData = chartData.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
    });

    setFilteredChartData(filteredData);
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading message or spinner
  }

  return (
    <div className="h-full p-4">
      <h1 className="mb-4 text-2xl font-bold">Energy Consumption Chart</h1>

      {/* Date Filter Section */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row">
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-semibold">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-semibold">End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
        </div>
        <button
          onClick={filterChartData}
          className="self-end px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Filter
        </button>
      </div>

      {/* Energy Consumption Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={filteredChartData}>
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

        {/* Sorting Options */}
        <div className="mb-4">
          <button
            onClick={() => sortLogs("asc")}
            className={`px-4 py-2 mr-2 rounded ${
              sortOrder === "asc" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Sort by Time (Asc)
          </button>
          <button
            onClick={() => sortLogs("desc")}
            className={`px-4 py-2 rounded ${
              sortOrder === "desc" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Sort by Time (Desc)
          </button>
        </div>

        {/* Logs Display */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredLogs && filteredLogs.length > 0 ? (
            filteredLogs.map((log) => {
              const formattedTime = new Date(
                `1970-01-01T${log.access_time}`
              ).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              });

              return (
                <div
                  key={log._id}
                  className="p-4 bg-white border border-gray-200 rounded-lg shadow-md"
                >
                  <h3 className="text-lg font-semibold text-blue-600">
                    {log.employee_name}
                  </h3>
                  <p className="text-sm text-gray-600">Time: {formattedTime}</p>
                  <p className="text-sm text-gray-600">
                    Date: {new Date(log.access_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Status: {log.algo_status}
                  </p>
                </div>
              );
            })
          ) : (
            <p>No logs found for this user.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chart;
