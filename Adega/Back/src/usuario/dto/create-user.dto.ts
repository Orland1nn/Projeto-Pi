export class CreateUserDto {
  readonly nome: string;
  readonly senha: string;
  readonly email?: string;
}