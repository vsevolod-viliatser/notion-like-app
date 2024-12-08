// src/components/DailyProductivityChart.js
import React, { useEffect, useState } from 'react';
import API from '../api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'react-toastify';

const DailyProductivityChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchDailyData = async () => {
      try {
        const response = await API.get('/productivity/dailyProductivity'); // Корректный путь
        setData(response.data);
      } catch (error) {
        console.error('Ошибка при получении дневной продуктивности:', error);
        toast.error('Не удалось получить дневную продуктивность.');
      }
    };

    fetchDailyData();
  }, []);

  return (
    <div className="chart-container">
      <h3>Денна продуктивність за останні 30 днів</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="count" name="Завершено задач" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyProductivityChart;