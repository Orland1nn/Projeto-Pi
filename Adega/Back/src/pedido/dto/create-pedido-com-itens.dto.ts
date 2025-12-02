export class CreatePedidoComItensDto {
  readonly formaPagamento: string;
  readonly status: string;

  readonly itens: Array<{
    produtoId: number;
    quantidade: number;
  }>;

  readonly pagamentos: Array<{
    tipo: string;   // pix, cartao, dinheiro...
    valor: number;  // valor pago
  }>;
}
