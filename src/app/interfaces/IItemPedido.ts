import Pedido from "../entities/Pedido";
import Produto from "../entities/Produto";

interface IItemPedido {
    id?: number;
    valorunit: number 
    total: number; 
    quantidade: number; 
    pedido: Pedido;
    produto: Produto;
}

export default IItemPedido;

