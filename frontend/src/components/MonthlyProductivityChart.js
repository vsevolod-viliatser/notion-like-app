// src/components/MonthlyProductivityChart.js
import React, { useEffect, useState } from 'react';
import API from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'react-toastify';

const MonthlyProductivityChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        const response = await API.get('/productivity/monthlyProductivity'); // Корректный путь
        setData(response.data);
      } catch (error) {
        console.error('Ошибка при получении месячной продуктивности:', error);
        toast.error('Не удалось получить месячную продуктивность.');
      }
    };

    fetchMonthlyData();
  }, []);

  return (
    <div className="chart-container">
      <h3>Месячная продуктивность за последний год</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" name="Завершено задач" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyProductivityChart;
