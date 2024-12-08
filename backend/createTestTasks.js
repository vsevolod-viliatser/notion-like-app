const axios = require('axios');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NTU3MmI3MmJlYjUwYWRmYjQxMDBmMSIsImlhdCI6MTczMzY1ODc2OSwiZXhwIjoxNzM2MjUwNzY5fQ.iTouaQzSRvJOFVHMs6taro4c23meDSnvLKUanrL2vds'; // Replace with your JWT

const BASE_URL_TASKS = 'http://localhost:5000/api/tasks';
const BASE_URL_TEMPLATES = 'http://localhost:5000/api/taskTemplates';
const BASE_URL_REMINDERS = 'http://localhost:5000/api/reminders';

// Helper function to add days to the current date
const addDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

// Create a task
const createTask = async (title, description, dueDate, recurring, recurrencePattern) => {
  try {
    const response = await axios.post(
      BASE_URL_TASKS,
      {
        title,
        description,
        dueDate,
        recurring,
        recurrencePattern,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log(`Task created: ${response.data.title}`);
  } catch (error) {
    console.error(
      `Error creating task "${title}":`,
      error.response?.data || error.message
    );
  }
};

// Create a task template
const createTaskTemplate = async (name, defaultTitle, defaultDescription, defaultDueDate, defaultRecurring, defaultRecurrencePattern) => {
  try {
    const response = await axios.post(
      BASE_URL_TEMPLATES,
      {
        name,
        defaultTitle,
        defaultDescription,
        defaultDueDate,
        defaultRecurring,
        defaultRecurrencePattern,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log(`Task template created: ${response.data.name}`);
  } catch (error) {
    console.error(
      `Error creating task template "${name}":`,
      error.response?.data || error.message
    );
  }
};

// Main function to populate data
const populateData = async () => {
  console.log('Starting data population...');

  // Task Templates
  const templates = [
    {
      name: 'Daily Routine',
      defaultTitle: 'Daily Stand-up',
      defaultDescription: 'Attend daily stand-up meeting',
      defaultDueDate: addDays(0),
      defaultRecurring: true,
      defaultRecurrencePattern: 'daily',
    },
    {
      name: 'Weekly Planning',
      defaultTitle: 'Weekly Sprint Planning',
      defaultDescription: 'Plan the sprint for the upcoming week',
      defaultDueDate: addDays(7),
      defaultRecurring: true,
      defaultRecurrencePattern: 'weekly',
    },
    {
      name: 'Monthly Review',
      defaultTitle: 'Monthly Team Review',
      defaultDescription: 'Review team performance for the month',
      defaultDueDate: addDays(30),
      defaultRecurring: true,
      defaultRecurrencePattern: 'monthly',
    },
  ];

  for (const template of templates) {
    await createTaskTemplate(
      template.name,
      template.defaultTitle,
      template.defaultDescription,
      template.defaultDueDate,
      template.defaultRecurring,
      template.defaultRecurrencePattern
    );
  }

  // Tasks
  const tasks = [
    {
      title: 'Daily Report Submission',
      description: 'Submit daily report to the manager.',
      dueDate: addDays(0),
      recurring: true,
      recurrencePattern: 'daily',
    },
    {
      title: 'Weekly Sync Meeting',
      description: 'Participate in the weekly sync meeting.',
      dueDate: addDays(7),
      recurring: true,
      recurrencePattern: 'weekly',
    },
    {
      title: 'Monthly Budget Review',
      description: 'Review and adjust monthly budget.',
      dueDate: addDays(30),
      recurring: true,
      recurrencePattern: 'monthly',
    },
    {
      title: 'One-time Task: Presentation Preparation',
      description: 'Prepare for the upcoming presentation.',
      dueDate: addDays(3),
      recurring: false,
      recurrencePattern: null,
    },
    {
      title: 'One-time Task: Doctor Appointment',
      description: 'Attend the scheduled doctor appointment.',
      dueDate: addDays(5),
      recurring: false,
      recurrencePattern: null,
    },
  ];

  for (const task of tasks) {
    await createTask(
      task.title,
      task.description,
      task.dueDate,
      task.recurring,
      task.recurrencePattern
    );
  }

  console.log('Data population complete!');
};

// Run the script
populateData();
