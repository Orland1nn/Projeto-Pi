export class CreatePedidoDto {
  readonly data: Date;
  readonly quantidade: number;
  readonly precoTotal: number;
  readonly produtoId: number;
  readonly userId: number;
}