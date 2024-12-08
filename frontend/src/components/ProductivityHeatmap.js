// src/components/ProductivityHeatmap.js
import React, { useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import API from '../api';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const ProductivityHeatmap = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchHeatmapData = async () => {
      try {
        const response = await API.get('/productivity/dailyProductivity'); // Корректный путь
        const heatmapData = response.data.map(item => ({
          date: item.date,
          count: item.count,
        }));
        setData(heatmapData);
      } catch (error) {
        console.error('Ошибка при получении данных для тепловой карты:', error);
      }
    };

    fetchHeatmapData();
  }, []);

  return (
    <div className="heatmap-container">
      <h3>Тепловая карта продуктивности</h3>
      <CalendarHeatmap
        startDate={new Date(new Date().setDate(new Date().getDate() - 30))}
        endDate={new Date()}
        values={data}
        classForValue={(value) => {
          if (!value) {
            return 'color-empty';
          }
          if (value.count >= 10) {
            return 'color-github-4';
          } else if (value.count >= 7) {
            return 'color-github-3';
          } else if (value.count >= 4) {
            return 'color-github-2';
          } else if (value.count >= 1) {
            return 'color-github-1';
          } else {
            return 'color-empty';
          }
        }}
        tooltipDataAttrs={value => {
          if (!value || !value.date) {
            return null;
          }
          return {
            'data-tooltip-id': 'heatmap-tooltip',
            'data-tooltip-content': `${value.date}: ${value.count} задач`,
          };
        }}
        showWeekdayLabels={true}
      />
      <Tooltip id="heatmap-tooltip" />
    </div>
  );
};

export default ProductivityHeatmap;