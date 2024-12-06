import Reminders from './Reminders';
import TaskManager from './TaskManager';
import TaskTemplateManager from './TaskTemplateManager';
import DailyProductivityChart from './DailyProductivityChart';
import WeeklyProductivityChart from './WeeklyProductivityChart';
import MonthlyProductivityChart from './MonthlyProductivityChart';
import ProductivityHeatmap from './ProductivityHeatmap';

const ProductivityDashboard = () => {
  return (
    <div className="productivity-dashboard">
      <h2>Productivity Overview</h2>

      {/* Напоминания */}
      <Reminders />

      {/* Управление задачами */}
      <TaskManager />

      {/* Управление шаблонами задач */}
      <TaskTemplateManager />

      {/* Графики продуктивности */}
      <DailyProductivityChart />
      <WeeklyProductivityChart />
      <MonthlyProductivityChart />
      <ProductivityHeatmap />
    </div>
  );
};

export default ProductivityDashboard;
