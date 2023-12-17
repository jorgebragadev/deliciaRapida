import Produto from "../entities/Produto";
import ProdutoInterface from "../interfaces/IProduto";
import { AppDataSource } from "../../database/data-source";

const ProdutoRepository = AppDataSource.getRepository(Produto);

const createProduto = async (
  produtoData: ProdutoInterface
): Promise<ProdutoInterface> => {
  const newProduto = ProdutoRepository.create(produtoData);
  const savedProduto = await ProdutoRepository.save(newProduto);
  return savedProduto;
};

const getProdutos = (): Promise<ProdutoInterface[]> => {
  return ProdutoRepository.find() as Promise<ProdutoInterface[]>;
};

const getProdutoById = async (
  produtoId: number
): Promise<ProdutoInterface | undefined> => {
  const Produto = await ProdutoRepository.findOne({ where: { id: produtoId } });

  return Produto || undefined;
};

const getProdutoNome = async (nome: string): Promise<Produto | undefined> => {
  const Produto = await ProdutoRepository.findOne({ where: { nome } });
  return Produto || undefined;
};

const deleteProduto = async (produtoId: number): Promise<boolean> => {
  const deleteResult = await ProdutoRepository.delete(produtoId);
  return deleteResult.affected === 1;
};

const updateProduto = async (
  produtoId: number,
  produtoData: Partial<ProdutoInterface>
): Promise<ProdutoInterface | undefined> => {
  let produto = await ProdutoRepository.findOne({ where: { id: produtoId } });

  if (!produto) {
    return undefined;
  }

  produto.nome = produtoData.nome || produto.nome;
  produto.preco = produtoData.preco || produto.preco;
  produto.estoque = produtoData.estoque || produto.estoque;

  produto = await ProdutoRepository.save(produto);

  return produto;
};

export default {
  createProduto,
  getProdutos,
  getProdutoById,
  getProdutoNome,
  updateProduto,
  deleteProduto,
};
