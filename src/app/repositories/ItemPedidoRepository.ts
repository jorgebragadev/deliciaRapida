import ItemPedido from "../entities/ItemPedido";
import ItemPedidoInterface from "../interfaces/IItemPedido";
import { AppDataSource } from "../../database/data-source";
import { getRepository } from "typeorm";

const ItemPedidoRepository = AppDataSource.getRepository(ItemPedido);

const createItemPedido = async (
  itemPedidoData: ItemPedidoInterface
): Promise<ItemPedidoInterface> => {
  const newItemPedido = ItemPedidoRepository.create(itemPedidoData);
  const savedItemPedido = await ItemPedidoRepository.save(newItemPedido);
  return savedItemPedido;
};

const getItemPedidos = (): Promise<ItemPedidoInterface[]> => {
  return ItemPedidoRepository.find() as Promise<ItemPedidoInterface[]>;
};

const getItemPedidoById = async (
  itemPedidoId: number
): Promise<ItemPedidoInterface | undefined> => {
  const itemPedido = await ItemPedidoRepository.findOne({
    where: { id: itemPedidoId },
  });
  return itemPedido || undefined;
};

const getItensPorPedido = async (
  pedidoId: number
): Promise<ItemPedidoInterface[] | undefined> => {
  try {
    const itemPedidoRepository = getRepository(ItemPedido);
    const itensDoPedido = await itemPedidoRepository.find({
      where: { pedido: { id: pedidoId } },
    });

    const itensDoPedidoTyped: ItemPedidoInterface[] = itensDoPedido.map(
      (item) => ({
        valorunit: item.valorunit,
        total: item.total,
        quantidade: item.quantidade,
        pedido: item.pedido,
        produto: item.produto,
      })
    );

    return itensDoPedidoTyped.length > 0 ? itensDoPedidoTyped : undefined;
  } catch (error) {
    console.error("Erro ao obter itens do pedido por ID:", error);
    throw new Error("Erro ao obter itens do pedido por ID.");
  }
};

const deleteItemPedido = async (itemPedidoId: number): Promise<boolean> => {
  const deleteResult = await ItemPedidoRepository.delete(itemPedidoId);
  return deleteResult.affected === 1;
};

const updateItemPedido = async (
  itemPedidoId: number,
  itemPedidoData: Partial<ItemPedidoInterface>
): Promise<ItemPedidoInterface | undefined> => {
  let itemPedido = await ItemPedidoRepository.findOne({
    where: { id: itemPedidoId },
  });

  if (!itemPedido) {
    return undefined;
  }

  itemPedido.valorunit = itemPedidoData.valorunit || itemPedido.valorunit;
  itemPedido.total = itemPedidoData.total || itemPedido.total;
  itemPedido.quantidade = itemPedidoData.quantidade || itemPedido.quantidade;

  itemPedido = await ItemPedidoRepository.save(itemPedido);

  return itemPedido;
};

export default {
  createItemPedido,
  getItemPedidos,
  getItemPedidoById,
  deleteItemPedido,
  updateItemPedido,
  getItensPorPedido,
};
