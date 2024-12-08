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
      <h2>Огляд продуктивності</h2>
      <Reminders />
      <TaskManager />
      <TaskTemplateManager />
      <DailyProductivityChart />
      <WeeklyProductivityChart />
      <MonthlyProductivityChart />
      <ProductivityHeatmap />
    </div>
  );
};

export default ProductivityDashboard;