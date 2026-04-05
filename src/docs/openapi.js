const dotenv = require('dotenv');

dotenv.config();

const productionServerUrl = 'https://finance-dashboard-backend-qt0u.onrender.com';
const serverUrl =
  process.env.NODE_ENV === 'production'
    ? productionServerUrl
    : 'http://localhost:5000';

const serverDescription =
  process.env.NODE_ENV === 'production'
    ? 'Production server'
    : 'Local development server';

const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Finance Dashboard Backend API',
    version: '1.0.0',
    description: 'Backend engineering assignment with authentication, RBAC, financial records, and aggregation-based analytics.'
  },
  servers: [
    {
      url: serverUrl,
      description: serverDescription
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Validation failed.' },
          details: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string', example: 'email' },
                message: { type: 'string', example: 'A valid email is required.' }
              }
            }
          }
        }
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '67f0c4657efed657b2af5101' },
          _id: { type: 'string', example: '67f0c4657efed657b2af5101' },
          name: { type: 'string', example: 'Admin User' },
          email: { type: 'string', example: 'admin@finance.local' },
          role: { type: 'string', enum: ['Viewer', 'Analyst', 'Admin'] },
          status: { type: 'string', enum: ['active', 'inactive'] },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      RegisterRequest: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'John Doe' },
          email: { type: 'string', example: 'john@example.com' },
          password: { type: 'string', example: 'Secret@123' }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'admin@finance.local' },
          password: { type: 'string', example: 'Admin@123' }
        }
      },
      AuthPayload: {
        type: 'object',
        properties: {
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          user: { $ref: '#/components/schemas/User' }
        }
      },
      FinanceRecordRequest: {
        type: 'object',
        required: ['amount', 'type', 'category', 'date'],
        properties: {
          amount: { type: 'number', example: 2000 },
          type: { type: 'string', enum: ['income', 'expense'] },
          category: { type: 'string', example: 'Freelance' },
          date: { type: 'string', format: 'date-time' },
          description: { type: 'string', example: 'April freelance project' }
        }
      },
      UpdateUserRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Updated Name' },
          role: { type: 'string', enum: ['Viewer', 'Analyst', 'Admin'] },
          status: { type: 'string', enum: ['active', 'inactive'] }
        }
      }
    }
  },
  paths: {
    '/health': {
      get: {
        tags: ['System'],
        summary: 'Health check',
        responses: {
          200: {
            description: 'Server is healthy'
          }
        }
      }
    },
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user as Viewer',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterRequest' }
            }
          }
        },
        responses: {
          201: { description: 'User registered' },
          409: { description: 'Email already exists' }
        }
      }
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login with email and password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' }
            }
          }
        },
        responses: {
          200: { description: 'Login successful' },
          401: { description: 'Invalid credentials' }
        }
      }
    },
    '/api/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get current user profile',
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Current user profile' },
          401: { description: 'Unauthorized' }
        }
      }
    },
    '/api/users': {
      get: {
        tags: ['Users'],
        summary: 'List users',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100 } },
          { name: 'role', in: 'query', schema: { type: 'string', enum: ['Viewer', 'Analyst', 'Admin'] } },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['active', 'inactive'] } }
        ],
        responses: {
          200: { description: 'Users fetched successfully' },
          403: { description: 'Admin only' }
        }
      }
    },
    '/api/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Get user by id',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'User fetched successfully' }
        }
      },
      patch: {
        tags: ['Users'],
        summary: 'Update user role or status',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateUserRequest' }
            }
          }
        },
        responses: {
          200: { description: 'User updated successfully' }
        }
      }
    },
    '/api/finance': {
      get: {
        tags: ['Finance'],
        summary: 'Get financial records with filters, search, and pagination',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100 } },
          { name: 'type', in: 'query', schema: { type: 'string', enum: ['income', 'expense'] } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date-time' } },
          { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date-time' } },
          { name: 'search', in: 'query', schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'Records fetched successfully' }
        }
      },
      post: {
        tags: ['Finance'],
        summary: 'Create a financial record',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/FinanceRecordRequest' }
            }
          }
        },
        responses: {
          201: { description: 'Record created successfully' },
          403: { description: 'Admin only' }
        }
      }
    },
    '/api/finance/{id}': {
      patch: {
        tags: ['Finance'],
        summary: 'Update a financial record',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/FinanceRecordRequest' }
            }
          }
        },
        responses: {
          200: { description: 'Record updated successfully' }
        }
      },
      delete: {
        tags: ['Finance'],
        summary: 'Soft delete a financial record',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Record deleted successfully' }
        }
      }
    },
    '/api/analytics/dashboard': {
      get: {
        tags: ['Analytics'],
        summary: 'Get combined dashboard analytics',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date-time' } },
          { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date-time' } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'type', in: 'query', schema: { type: 'string', enum: ['income', 'expense'] } },
          { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 20 } }
        ],
        responses: {
          200: { description: 'Dashboard analytics fetched successfully' }
        }
      }
    },
    '/api/analytics/summary': {
      get: {
        tags: ['Analytics'],
        summary: 'Get total income, total expenses, and net balance',
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Summary analytics fetched successfully' }
        }
      }
    },
    '/api/analytics/category-totals': {
      get: {
        tags: ['Analytics'],
        summary: 'Get category-wise totals',
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Category totals fetched successfully' }
        }
      }
    },
    '/api/analytics/monthly-trends': {
      get: {
        tags: ['Analytics'],
        summary: 'Get monthly trends for income and expenses',
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Monthly trends fetched successfully' }
        }
      }
    },
    '/api/analytics/recent-transactions': {
      get: {
        tags: ['Analytics'],
        summary: 'Get recent transactions',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 20 } }],
        responses: {
          200: { description: 'Recent transactions fetched successfully' }
        }
      }
    }
  }
};

module.exports = openApiSpec;
