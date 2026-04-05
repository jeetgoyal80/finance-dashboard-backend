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

const buildSampleRecords = (adminId) => [
  {
    amount: 5000,
    type: RECORD_TYPES.INCOME,
    category: 'Salary',
    date: new Date('2026-01-05'),
    description: 'January salary',
    createdBy: adminId
  },
  {
    amount: 1200,
    type: RECORD_TYPES.EXPENSE,
    category: 'Rent',
    date: new Date('2026-01-07'),
    description: 'Monthly rent payment',
    createdBy: adminId
  },
  {
    amount: 850,
    type: RECORD_TYPES.EXPENSE,
    category: 'Groceries',
    date: new Date('2026-02-03'),
    description: 'Supermarket shopping',
    createdBy: adminId
  },
  {
    amount: 2200,
    type: RECORD_TYPES.INCOME,
    category: 'Freelance',
    date: new Date('2026-02-18'),
    description: 'Consulting engagement',
    createdBy: adminId
  },
  {
    amount: 430,
    type: RECORD_TYPES.EXPENSE,
    category: 'Utilities',
    date: new Date('2026-03-02'),
    description: 'Electricity and internet bill',
    createdBy: adminId
  },
  {
    amount: 5100,
    type: RECORD_TYPES.INCOME,
    category: 'Salary',
    date: new Date('2026-03-05'),
    description: 'March salary',
    createdBy: adminId
  }
];

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
