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
  const [sortOrder, setSortOrder] = useState("asc");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredChartData, setFilteredChartData] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/v1/log/logsALL`);
        const data = await response.json();
        const logsinfo = data.logs || [];

        const userData = JSON.parse(localStorage.getItem("userData"));
        const loggedInEmployeeName = userData?.firstname;

        const filteredLogs = logsinfo.filter(
          (log) => log.employee_name === loggedInEmployeeName
        );

        setFilteredLogs(filteredLogs);

        const storedData = JSON.parse(localStorage.getItem("chartData")) || [];
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

        setChartData(formattedData);
        setFilteredChartData(formattedData);
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const sortLogs = (order) => {
    const sortedLogs = [...filteredLogs].sort((a, b) => {
      const timeA = new Date(`1970-01-01T${a.access_time}`).getTime();
      const timeB = new Date(`1970-01-01T${b.access_time}`).getTime();
      return order === "asc" ? timeA - timeB : timeB - timeA;
    });
    setFilteredLogs(sortedLogs);
    setSortOrder(order);
  };

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
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader" />
      </div>
    );
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
      {filteredChartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={filteredChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis
              label={{
                value: "Energy Consumed (kWh)",
                angle: -90,
                position: "insideLeft",
                dy: 60,
              }}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="onMode" name="Energy Consumption" fill="#2078d6" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-lg font-semibold text-center text-gray-600 h-72">
          No data available for the selected date range.
        </p>
      )}

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
