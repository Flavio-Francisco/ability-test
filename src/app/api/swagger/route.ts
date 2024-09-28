// src/app/api/swagger/route.ts
import swaggerJsdoc from 'swagger-jsdoc';
import { NextResponse } from 'next/server';



export async function GET() {
    const swaggerDefinition = {
        openapi: '3.0.0',
        info: {
          title: 'Documentação da API',
          version: '1.0.0',
          description: 'API de gerenciamento de usuários',
        },
        servers: [
          {
            url: 'http://localhost:3000', 
            description: 'Servidor local',
          },
        ],
      };
      
      const options = {
        swaggerDefinition,
        apis: ['./src/app/api/**/*.ts'], 
      };
      
      const swaggerSpec = swaggerJsdoc(options);
  return NextResponse.json(swaggerSpec);
}
