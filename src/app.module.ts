import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from './drizzle/drizzle.module';
import { AuthModule } from './auth/auth.module';
import { SaasUsersModule } from './saas-users/saas-users.module';

// Importe os novos módulos
import { AdminModule } from './admin/admin.module';
import { DashboardModule } from './dashboard/dashboard.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DrizzleModule,
    AuthModule,
    SaasUsersModule,

    // Adicione aqui:
    AdminModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
