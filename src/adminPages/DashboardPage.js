import React, { useState, useEffect } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import apiService from "../app/apiService";

const yTicks = [0, 10, 20, 30, 40, 50];
const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00"];

export default function Dashboard() {
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [orderStatusBreakdown, setOrderStatusBreakdown] = useState([]);
  const [averageRevenue, setAverageRevenue] = useState(0);
  const [ordersByMonth, setOrdersByMonth] = useState([]);
  const [year, setYear] = useState({ year: 2024 });

  useEffect(() => {
    const fetchOrdersByYear = async (year) => {
      try {
        const response = await apiService.get(
          `/api/statistics/orders/by-year/${year}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        const ordersByMonthData = response.data.result;
        const transformedOrdersByMonthData = Object.entries(
          ordersByMonthData
        ).map(([month, numberOfOrders]) => ({
          month: parseInt(month, 10),
          numberOfOrders,
        }));
        setOrdersByMonth(transformedOrdersByMonthData);
      } catch (error) {
        console.error("Error fetching orders by year:", error);
      }
    };

    fetchOrdersByYear(2024);
    const interval = setInterval(() => {
      fetchOrdersByYear(2024);
    }, 60000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const orderStatusResponse = await apiService.get(
        "/api/statistics/orders/status/breakdown",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const totalOrdersResponse = await apiService.get(
        "/api/statistics/orders/total",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const totalRevenueResponse = await apiService.get(
        "/api/statistics/orders/revenue/total",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const averageRevenueResponse = await apiService.get(
        "/api/statistics/orders/revenue/average",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      const orderStatusBreakdownResponse = await apiService.get(
        "/api/statistics/orders/status/breakdown",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      setOrderStatusBreakdown(orderStatusResponse.data.result);
      setTotalOrders(totalOrdersResponse.data.result);
      setTotalRevenue(totalRevenueResponse.data.result);
      setAverageRevenue(averageRevenueResponse.data.result);

      const orderStatusBreakdownData = orderStatusBreakdownResponse.data.result;

      const transformedOrderStatusBreakdownData = Object.entries(
        orderStatusBreakdownData
      ).map(([status, numberOfOrders]) => ({
        status,
        numberOfOrders,
      }));

      setOrderStatusBreakdown(transformedOrderStatusBreakdownData);
    };

    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 60000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);
  const handleChooseYear = async (event) => {
    const selectedYear = event.target.value;
    setYear(selectedYear);

    const response = await apiService.get(
      `/api/statistics/orders/by-year/${selectedYear}`
    );
    const data = response.data.result;

    const transformedData = Object.entries(data).map(
      ([month, numberOfOrders]) => ({
        month: parseInt(month, 10),
        numberOfOrders,
      })
    );

    setOrdersByMonth(transformedData);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={4}>
        <Paper sx={{ padding: 3, textAlign: "center" }}>
          <Typography variant="h6">Total Orders</Typography>
          <Typography variant="h4">{totalOrders}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper sx={{ padding: 3, textAlign: "center" }}>
          <Typography variant="h6">Total Revenue</Typography>
          <Typography variant="h4">{totalRevenue.toFixed(2)}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper sx={{ padding: 3, textAlign: "center" }}>
          <Typography variant="h6">Average Revenue per Order</Typography>
          <Typography variant="h4">{averageRevenue.toFixed(2)}</Typography>
        </Paper>
      </Grid>

      <Grid item xs={8}>
        <Paper sx={{ padding: 8 }}>
          <Typography variant="h6">Monthly number of orders by year</Typography>
          {
            <ResponsiveContainer width="100%" height={300}>
              <select value={year} onChange={handleChooseYear}>
                <option value="">Year</option>
                <option value="2021">2021</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
              </select>
              <LineChart
                data={ordersByMonth}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <Line
                  type="monotone"
                  dataKey="numberOfOrders"
                  name="Number of orders"
                ></Line>
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="month" />
                <YAxis ticks={yTicks} />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          }
        </Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper sx={{ padding: 8 }}>
          <Typography variant="h6">
            Current number of orders per status
          </Typography>
          <ResponsiveContainer width="100%" height={268}>
            <PieChart margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <Pie
                data={orderStatusBreakdown}
                dataKey="numberOfOrders"
                nameKey="status"
                label
              >
                {orderStatusBreakdown.length > 0 ? (
                  orderStatusBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index]} />
                  ))
                ) : (
                  <text x="50%" y="50%" dy={0.3}>
                    Loading data...
                  </text>
                )}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
}
