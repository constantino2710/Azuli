export class CreateSaasUserDto {
  email: string;
  password: string;
  isSuperAdmin?: boolean; // Opcional, para permitir criar admins
}
