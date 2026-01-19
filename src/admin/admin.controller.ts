import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SuperAdminGuard } from '../auth/super-admin.guard';

interface AuthenticatedRequest extends Request {
  user: {
    email: string;
  };
}

// Esta rota será acessível em: http://localhost:3000/admin
@Controller('admin')
export class AdminController {
  // Aplica os dois guards:
  // 1. AuthGuard('jwt'): Garante que o token é válido
  // 2. SuperAdminGuard: Garante que é admin
  @UseGuards(AuthGuard('jwt'), SuperAdminGuard)
  @Get()
  getAdminDashboard(@Request() req: AuthenticatedRequest) {
    return {
      message: 'Bem-vindo ao Painel de Super Admin 🚀',
      user: req.user.email,
      stats: {
        totalRevenue: 50000.0,
        activeTenants: 12,
        serverStatus: 'OK',
      },
    };
  }
}
