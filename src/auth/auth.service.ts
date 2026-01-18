/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from '@nestjs/common';
import { SaasUsersService } from '../saas-users/saas-users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private saasUsersService: SaasUsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.saasUsersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      // Removemos a password do objeto retornado
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      isSuperAdmin: user.isSuperAdmin,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
