interface IPedidoFormatado {
    Pedido: number;
    Cliente: string;
    Data: string;
    Status: string;
    'Total do Pedido': number;
    Itens: Array<{
      Produto: string;
      Quantidade: number;
      Subtotal: number;
      'Total do Item': number;
    }>;
  }
  
  export default IPedidoFormatado;
  