import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  checkHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    };
  }

  @Get('ready')
  checkReadiness() {
    // Add any additional readiness checks here
    // For example, database connectivity, external service availability
    return {
      status: 'ready',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'ok', // Implement actual database check
        cache: 'ok',    // Implement actual cache check
      },
    };
  }

  @Get('live')
  checkLiveness() {
    // Simple liveness check
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
    };
  }
}