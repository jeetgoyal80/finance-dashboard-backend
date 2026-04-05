const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const env = require('./config/env');
const openApiSpec = require('./docs/openapi');
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/user/user.routes');
const financeRoutes = require('./modules/finance/finance.routes');
const analyticsRoutes = require('./modules/analytics/analytics.routes');
const { notFoundHandler, errorHandler } = require('./middleware/error.middleware');

const app = express();
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(helmet());
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.status(200).send({
    success: true,
    message: 'Finance Dashboard Backend API is running.',
    docs: '/api-docs',
    health: '/health'
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Finance dashboard backend is running.'
  });
});

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(openApiSpec, {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true
    },
    customSiteTitle: env.nodeEnv === 'production' ? 'Finance Dashboard API Docs' : 'Finance Dashboard API Docs (Local)'
  })
);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
