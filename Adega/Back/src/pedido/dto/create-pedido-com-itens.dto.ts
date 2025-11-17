export class CreatePedidoComItensDto {
  readonly formaPagamento: string;
  readonly status: string;
  readonly itens: Array<{
    produtoId: number;
    quantidade: number;
  }>;
}
