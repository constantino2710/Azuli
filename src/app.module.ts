import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // <--- Importante
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrizzleModule } from './drizzle/drizzle.module';
import { SaasUsersModule } from './saas-users/saas-users.module';

@Module({
  imports: [
    // Isto carrega o ficheiro .env para a aplicação
    ConfigModule.forRoot({ isGlobal: true }),
    DrizzleModule,
    SaasUsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
