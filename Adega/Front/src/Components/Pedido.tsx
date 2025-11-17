interface PedidoProps {
  id: number;
  totalItens: number;
  precoTotal: number;
  status: string;
  formaPagamento: string;
}

export default function Pedido({
  id,
  totalItens,
  precoTotal,
  formaPagamento,
  status,
}: PedidoProps) {
  return (
    <div className="grid grid-cols-5 gap-4 border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer text-base font-medium text-gray-800 hover:bg-amber-100">
      <p>{id}</p>
      <p>{totalItens}</p>
      <p>R$ {precoTotal}</p>
      <p>{formaPagamento}</p>
      <p>{status}</p>
    </div>
  );
}
