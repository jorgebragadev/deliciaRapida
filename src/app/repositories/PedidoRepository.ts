import Pedido from "../entities/Pedido";
import PedidoInterface from "../interfaces/IPedido";
import { AppDataSource } from "../../database/data-source";
import ItemPedidoRepository from "./ItemPedidoRepository";


const PedidoRepository = AppDataSource.getRepository(Pedido);

const createPedido = async (
  pedidoData: PedidoInterface
): Promise<PedidoInterface> => {
  const newPedido = PedidoRepository.create(pedidoData);
  const savedPedido = await PedidoRepository.save(newPedido);
  return savedPedido;
};

const getPedidos = (): Promise<PedidoInterface[]> => {
  return PedidoRepository.find() as Promise<PedidoInterface[]>;
};

const getPedidoById = async (
  pedidoId: number
): Promise<PedidoInterface | undefined> => {
  const pedido = await PedidoRepository.findOne({ where: { id: pedidoId } });
  return pedido || undefined;
};

const getPedidosByStatus = async (
  status: string
): Promise<PedidoInterface[]> => {
  const pedidos = await PedidoRepository.find({ where: { status } });

  const pedidosComItens = await Promise.all(
    pedidos.map(async (pedido) => {
      const itens = await ItemPedidoRepository.getItemPedidoById(pedido.id); 
      return { ...pedido, itens };

      
    })
  );

  return pedidosComItens;

};

const deletePedido = async (pedidoId: number): Promise<boolean> => {
  const deleteResult = await PedidoRepository.delete(pedidoId);
  return deleteResult.affected === 1;
};

const updatePedido = async (
  pedidoId: number,
  pedidoData: Partial<PedidoInterface>
): Promise<PedidoInterface | undefined> => {
  let pedido = await PedidoRepository.findOne({ where: { id: pedidoId } });

  if (!pedido) {
    return undefined;
  }


  pedido.total = pedidoData.total || pedido.total;
  pedido.formapagamento = pedidoData.formapagamento || pedido.formapagamento;
  pedido.status = pedidoData.status || pedido.status;

  pedido = await PedidoRepository.save(pedido);

  return pedido;
};

export default {
  createPedido,
  getPedidos,
  getPedidoById,
  deletePedido,
  updatePedido,
  getPedidosByStatus
};
