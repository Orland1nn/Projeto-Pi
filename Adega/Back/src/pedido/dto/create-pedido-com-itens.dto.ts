export class CreatePedidoComItensDto {
  readonly data: Date;
  readonly formaPagamento: string;
  readonly itens: Array<{
    produtoId: number;
    quantidade: number;
  }>;
}