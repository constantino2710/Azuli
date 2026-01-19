import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: { isSuperAdmin: boolean };
}

@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    // 1. Verifica se o usuário existe (se o AuthGuard('jwt') funcionou antes)
    if (!user) {
      throw new UnauthorizedException('Usuário não autenticado.');
    }

    // 2. Verifica se a flag isSuperAdmin é verdadeira
    // Lembre-se: isso vem do seu JwtStrategy
    if (!user.isSuperAdmin) {
      throw new ForbiddenException(
        'Acesso negado: Requer privilégios de Super Admin.',
      );
    }

    return true;
  }
}
