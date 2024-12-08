// src/components/WeeklyProductivityChart.js
import React, { useEffect, useState } from 'react';
import API from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'react-toastify';

const WeeklyProductivityChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        const response = await API.get('/productivity/weeklyProductivity'); // Корректный путь
        setData(response.data);
      } catch (error) {
        console.error('Ошибка при получении недельной продуктивности:', error);
        toast.error('Не удалось получить недельную продуктивность.');
      }
    };

    fetchWeeklyData();
  }, []);

  return (
    <div className="chart-container">
      <h3>Тижнева продуктивність за останній рік</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" name="Завершено задач" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyProductivityChart;