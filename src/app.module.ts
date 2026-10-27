import { Controller, Get, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@common/decorators/public.decorator';

/**
 * Lightweight system health-check controller for container orchestration (Docker)
 * and readiness probes.
 */
@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Public()
  @Get()
  @ApiOperation({ summary: 'Verify API availability and uptime' })
  @ApiOkResponse({
    description: 'Service is healthy and accepting requests.',
  })
  check() {
    return {
      status: 'ok',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };
  }
}

/**
 * Root Application Module.
 *
 * Centralizes global configuration (`ConfigModule`), database connections,
 * cross-cutting architectural modules (CQRS, EventEmitter, ClientsModule for API Gateway),
 * and feature modules located under `src/modules/`.
 */
@Module({
  imports: [
    // 1. Global Environment Configuration (.env)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 2. Database Connection (Uncomment & configure according to test stack)
    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => ({
    //     type: 'postgres',
    //     host: config.get<string>('DB_HOST'),
    //     port: config.get<number>('DB_PORT'),
    //     username: config.get<string>('DB_USERNAME'),
    //     password: config.get<string>('DB_PASSWORD'),
    //     database: config.get<string>('DB_NAME'),
    //     autoLoadEntities: true,
    //     synchronize: config.get<string>('NODE_ENV') !== 'production',
    //   }),
    // }),

    // 3. Feature Modules (Package by Feature)
    // Register your domain modules from `src/modules/` here:
    // ItemModule,
  ],
  controllers: [HealthController],
  providers: [
    // Optional: Enable JwtAuthGuard globally across all endpoints
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
})
export class AppModule {}

