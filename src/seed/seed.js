const dotenv = require('dotenv');

dotenv.config();

const connectDatabase = require('../config/db');
const User = require('../modules/user/user.model');
const FinanceRecord = require('../modules/finance/finance.model');
const { ROLES, USER_STATUSES, RECORD_TYPES } = require('../utils/constants');

const sampleUsers = [
  {
    name: 'System Admin',
    email: 'admin@finance.local',
    password: 'Admin@123',
    role: ROLES.ADMIN,
    status: USER_STATUSES.ACTIVE
  },
  {
    name: 'Business Analyst',
    email: 'analyst@finance.local',
    password: 'Analyst@123',
    role: ROLES.ANALYST,
    status: USER_STATUSES.ACTIVE
  },
  {
    name: 'Read Only Viewer',
    email: 'viewer@finance.local',
    password: 'Viewer@123',
    role: ROLES.VIEWER,
    status: USER_STATUSES.ACTIVE
  }
];

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June'];

const INCOME_CATEGORIES = {
  Salary: [
    'Monthly salary credit',
    'Primary salary payment',
    'Salary credited to bank account'
  ],
  Freelance: [
    'Freelance web development payout',
    'Consulting engagement payment',
    'Client invoice settlement',
    'Freelance product design payment'
  ],
  Bonus: [
    'Performance bonus credited',
    'Quarterly incentive payout',
    'Project completion bonus'
  ],
  Investment: [
    'Dividend income received',
    'Mutual fund redemption gain',
    'Investment return credited',
    'Stock profit withdrawal'
  ]
};

const EXPENSE_CATEGORIES = {
  Rent: [
    'Monthly apartment rent',
    'House rent payment',
    'Rent transferred to landlord'
  ],
  Groceries: [
    'Grocery shopping',
    'Supermarket essentials',
    'Weekly groceries purchase',
    'Household groceries restock'
  ],
  Food: [
    'Dinner at restaurant',
    'Lunch order',
    'Cafe and snacks',
    'Food delivery expense',
    'Weekend dining out'
  ],
  Travel: [
    'Weekend trip booking',
    'Flight ticket payment',
    'Train and taxi expenses',
    'Outstation travel expense'
  ],
  Utilities: [
    'Electricity bill',
    'Internet bill payment',
    'Water and maintenance charges',
    'Mobile and utility recharge'
  ],
  Entertainment: [
    'Movie night expense',
    'Streaming subscription payment',
    'Concert or event ticket',
    'Gaming and leisure spend'
  ],
  Healthcare: [
    'Pharmacy purchase',
    'Doctor consultation fee',
    'Routine health checkup',
    'Medical expense reimbursement gap'
  ],
  Shopping: [
    'Clothing and apparel shopping',
    'Online shopping order',
    'Home essentials purchase',
    'Personal care shopping'
  ]
};

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomChance = (probability) => Math.random() < probability;

const randomChoice = (items) => {
  return items[randomInt(0, items.length - 1)];
};

const randomAmount = (min, max) => {
  return Number((Math.random() * (max - min) + min).toFixed(2));
};

const getDaysInMonth = (year, monthIndex) => {
  return new Date(year, monthIndex + 1, 0).getDate();
};

const randomDateInMonth = (year, monthIndex, minDay = 1, maxDay) => {
  const lastDay = getDaysInMonth(year, monthIndex);
  const safeMaxDay = Math.min(maxDay || lastDay, lastDay);
  const safeMinDay = Math.min(minDay, safeMaxDay);
  const day = randomInt(safeMinDay, safeMaxDay);
  const hours = randomInt(9, 20);
  const minutes = randomInt(0, 59);
  const seconds = randomInt(0, 59);

  return new Date(year, monthIndex, day, hours, minutes, seconds);
};

const addRecord = (records, { amount, type, category, date, description, createdBy }) => {
  records.push({
    amount,
    type,
    category,
    date,
    description,
    createdBy
  });
};

const createRecurringRecord = (records, { year, monthIndex, amount, type, category, description, createdBy, dayRange }) => {
  addRecord(records, {
    amount,
    type,
    category,
    date: randomDateInMonth(year, monthIndex, dayRange[0], dayRange[1]),
    description,
    createdBy
  });
};

const createBatchRecords = (records, { year, monthIndex, count, type, category, amountRange, descriptions, createdBy, dayRange }) => {
  for (let index = 0; index < count; index += 1) {
    addRecord(records, {
      amount: randomAmount(amountRange[0], amountRange[1]),
      type,
      category,
      date: randomDateInMonth(year, monthIndex, dayRange[0], dayRange[1]),
      description: randomChoice(descriptions),
      createdBy
    });
  }
};

const addSupplementalExpense = (records, adminId) => {
  const monthIndex = randomInt(0, MONTH_NAMES.length - 1);
  const expenseTemplates = [
    {
      category: 'Groceries',
      amountRange: [45, 140],
      descriptions: EXPENSE_CATEGORIES.Groceries
    },
    {
      category: 'Food',
      amountRange: [12, 65],
      descriptions: EXPENSE_CATEGORIES.Food
    },
    {
      category: 'Shopping',
      amountRange: [35, 220],
      descriptions: EXPENSE_CATEGORIES.Shopping
    }
  ];

  const template = randomChoice(expenseTemplates);

  createBatchRecords(records, {
    year: 2026,
    monthIndex,
    count: 1,
    type: RECORD_TYPES.EXPENSE,
    category: template.category,
    amountRange: template.amountRange,
    descriptions: template.descriptions,
    createdBy: adminId,
    dayRange: [3, 28]
  });
};

const buildMonthlyRecords = (adminId, { year, monthIndex, baseSalary, baseRent }) => {
  const records = [];
  const monthName = MONTH_NAMES[monthIndex];

  createRecurringRecord(records, {
    year,
    monthIndex,
    amount: randomAmount(baseSalary - 200, baseSalary + 200),
    type: RECORD_TYPES.INCOME,
    category: 'Salary',
    description: `${monthName} salary credit`,
    createdBy: adminId,
    dayRange: [1, 5]
  });

  createRecurringRecord(records, {
    year,
    monthIndex,
    amount: randomAmount(baseRent - 50, baseRent + 50),
    type: RECORD_TYPES.EXPENSE,
    category: 'Rent',
    description: `Monthly rent payment for ${monthName}`,
    createdBy: adminId,
    dayRange: [1, 7]
  });

  createBatchRecords(records, {
    year,
    monthIndex,
    count: 5,
    type: RECORD_TYPES.EXPENSE,
    category: 'Groceries',
    amountRange: [45, 140],
    descriptions: EXPENSE_CATEGORIES.Groceries,
    createdBy: adminId,
    dayRange: [2, 28]
  });

  createBatchRecords(records, {
    year,
    monthIndex,
    count: 5,
    type: RECORD_TYPES.EXPENSE,
    category: 'Food',
    amountRange: [12, 65],
    descriptions: EXPENSE_CATEGORIES.Food,
    createdBy: adminId,
    dayRange: [1, 28]
  });

  createBatchRecords(records, {
    year,
    monthIndex,
    count: 1,
    type: RECORD_TYPES.EXPENSE,
    category: 'Utilities',
    amountRange: [55, 180],
    descriptions: EXPENSE_CATEGORIES.Utilities,
    createdBy: adminId,
    dayRange: [5, 26]
  });

  createBatchRecords(records, {
    year,
    monthIndex,
    count: 1,
    type: RECORD_TYPES.EXPENSE,
    category: 'Shopping',
    amountRange: [35, 220],
    descriptions: EXPENSE_CATEGORIES.Shopping,
    createdBy: adminId,
    dayRange: [4, 27]
  });

  if (randomChance(0.65)) {
    createBatchRecords(records, {
      year,
      monthIndex,
      count: randomInt(1, 2),
      type: RECORD_TYPES.EXPENSE,
      category: 'Entertainment',
      amountRange: [20, 120],
      descriptions: EXPENSE_CATEGORIES.Entertainment,
      createdBy: adminId,
      dayRange: [6, 29]
    });
  }

  if (randomChance(0.45)) {
    createBatchRecords(records, {
      year,
      monthIndex,
      count: 1,
      type: RECORD_TYPES.EXPENSE,
      category: 'Healthcare',
      amountRange: [25, 180],
      descriptions: EXPENSE_CATEGORIES.Healthcare,
      createdBy: adminId,
      dayRange: [3, 25]
    });
  }

  if (randomChance(0.35)) {
    createBatchRecords(records, {
      year,
      monthIndex,
      count: 1,
      type: RECORD_TYPES.EXPENSE,
      category: 'Travel',
      amountRange: [90, 650],
      descriptions: EXPENSE_CATEGORIES.Travel,
      createdBy: adminId,
      dayRange: [8, 28]
    });
  }

  if (randomChance(0.7)) {
    createBatchRecords(records, {
      year,
      monthIndex,
      count: randomInt(1, 2),
      type: RECORD_TYPES.INCOME,
      category: 'Investment',
      amountRange: [120, 950],
      descriptions: INCOME_CATEGORIES.Investment,
      createdBy: adminId,
      dayRange: [10, 28]
    });
  }

  if (randomChance(0.55)) {
    createBatchRecords(records, {
      year,
      monthIndex,
      count: 1,
      type: RECORD_TYPES.INCOME,
      category: 'Freelance',
      amountRange: [400, 2400],
      descriptions: INCOME_CATEGORIES.Freelance,
      createdBy: adminId,
      dayRange: [7, 27]
    });
  }

  if (randomChance(0.3)) {
    createBatchRecords(records, {
      year,
      monthIndex,
      count: 1,
      type: RECORD_TYPES.INCOME,
      category: 'Bonus',
      amountRange: [500, 1800],
      descriptions: INCOME_CATEGORIES.Bonus,
      createdBy: adminId,
      dayRange: [12, 25]
    });
  }

  return records;
};

const buildSampleRecords = (adminId) => {
  const records = [];
  const year = 2026;
  const salaryBase = 5200;
  const rentBase = 1350;

  for (let monthIndex = 0; monthIndex < MONTH_NAMES.length; monthIndex += 1) {
    records.push(
      ...buildMonthlyRecords(adminId, {
        year,
        monthIndex,
        baseSalary: salaryBase,
        baseRent: rentBase
      })
    );
  }

  while (records.length < 80) {
    addSupplementalExpense(records, adminId);
  }

  if (records.length > 120) {
    const removableCategories = new Set([
      'Entertainment',
      'Travel',
      'Healthcare',
      'Investment',
      'Freelance',
      'Bonus',
      'Shopping'
    ]);

    const essentialRecords = records.filter((record) => !removableCategories.has(record.category));
    const removableRecords = records.filter((record) => removableCategories.has(record.category));
    const slotsAvailable = Math.max(120 - essentialRecords.length, 0);

    records.length = 0;
    records.push(...essentialRecords, ...removableRecords.slice(0, slotsAvailable));
  }

  return records.sort((left, right) => left.date - right.date);
};

const seed = async () => {
  await connectDatabase();

  await User.deleteMany({});
  await FinanceRecord.deleteMany({});

  const createdUsers = await User.create(sampleUsers);
  const adminUser = createdUsers.find((user) => user.role === ROLES.ADMIN);

  await FinanceRecord.insertMany(buildSampleRecords(adminUser._id));

  console.log('Seed completed successfully');
  console.log('Admin: admin@finance.local / Admin@123');
  console.log('Analyst: analyst@finance.local / Analyst@123');
  console.log('Viewer: viewer@finance.local / Viewer@123');

  process.exit(0);
};

seed().catch((error) => {
  console.error('Seed failed:', error.message);
  process.exit(1);
});
