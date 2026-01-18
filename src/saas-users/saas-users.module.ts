import { Module } from '@nestjs/common';
import { SaasUsersService } from './saas-users.service';
import { SaasUsersController } from './saas-users.controller';

@Module({
  controllers: [SaasUsersController],
  providers: [SaasUsersService],
})
export class SaasUsersModule {}
