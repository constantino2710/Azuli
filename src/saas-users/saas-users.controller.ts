import { Body, Controller, Post } from '@nestjs/common';
import { SaasUsersService } from './saas-users.service';
import { CreateSaasUserDto } from './dto/create-saas-user.dto';

@Controller('saas-users')
export class SaasUsersController {
  constructor(private readonly saasUsersService: SaasUsersService) {}

  @Post()
  create(@Body() createUserDto: CreateSaasUserDto) {
    return this.saasUsersService.createUser(createUserDto);
  }
}
