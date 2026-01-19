import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

interface AuthenticatedRequest extends Request {
  user: {
    email: string;
    isSuperAdmin: boolean;
  };
}

// Esta rota será acessível em: http://localhost:3000/dashboard
@Controller('dashboard')
export class DashboardController {
  // Apenas AuthGuard('jwt') é necessário aqui
  @UseGuards(AuthGuard('jwt'))
  @Get()
  getUserDashboard(@Request() req: AuthenticatedRequest) {
    return {
      message: 'Bem-vindo ao seu Dashboard',
      user: req.user.email,
      role: req.user.isSuperAdmin ? 'Admin (mas vendo a view de user)' : 'User',
      myCourses: [{ id: 1, title: 'Curso de NestJS', progress: '40%' }],
    };
  }
}
