const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MetricsHub API',
      version: '1.0.0',
      description: 'REST API для дашборда бизнес-метрик MetricsHub',
    },
    servers: [{ url: `http://localhost:${process.env.PORT || 3001}` }],
    components: {
      schemas: {
        Metric: {
          type: 'object',
          properties: {
            id:        { type: 'integer', example: 1 },
            name:      { type: 'string', example: 'Revenue', maxLength: 10 },
            value:     { type: 'number', example: 125000 },
            unit:      { type: 'string', example: 'USD' },
            category:  { type: 'string', enum: ['Finance','Marketing','Sales','Operations','HR'] },
            trend:     { type: 'number', example: 5.2 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        MetricInput: {
          type: 'object',
          required: ['name', 'value', 'unit', 'category'],
          properties: {
            name:     { type: 'string', maxLength: 10, example: 'Revenue' },
            value:    { type: 'number', minimum: 0, maximum: 999999, example: 125000 },
            unit:     { type: 'string', maxLength: 10, example: 'USD' },
            category: { type: 'string', enum: ['Finance','Marketing','Sales','Operations','HR'] },
            trend:    { type: 'number', minimum: -9999, maximum: 9999, example: 5.2 },
          },
        },
        Category: {
          type: 'object',
          properties: {
            name:  { type: 'string', example: 'Finance' },
            count: { type: 'integer', example: 3 },
          },
        },
        Log: {
          type: 'object',
          properties: {
            id:        { type: 'integer', example: 1 },
            method:    { type: 'string', example: 'GET' },
            url:       { type: 'string', example: '/api/metrics' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Not found' },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            errors: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    },
  },
  apis: ['./routes/api/*.js'],
};

module.exports = swaggerJsdoc(options);
