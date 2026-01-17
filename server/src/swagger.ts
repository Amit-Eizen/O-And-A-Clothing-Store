import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'O&A Clothing Store API',
            version: '1.0.0',
            description: 'A RESTful API for O&A Clothing Store',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}`,
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter JWT Bearer token',
                },
            },
        },
        tags: [
            { name: 'Authentication', description: 'Authentication endpoints' },
            { name: 'Products', description: 'Product management' },
            { name: 'Cart', description: 'Shopping cart' },
            { name: 'Orders', description: 'Order management' },
            { name: 'Comments', description: 'Product comments' },
        ],
    },
    apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
