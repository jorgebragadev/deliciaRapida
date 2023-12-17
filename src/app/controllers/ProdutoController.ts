import { Request, Response, Router } from "express";
import ProdutoRepository from "../repositories/ProdutoRepository";
import ProdutoInterface from "../interfaces/IProduto";

const routeProduto = Router();

export const getProdutos = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    const produtos = await ProdutoRepository.getProdutos();
    return res.status(200).json(produtos);
  } catch (error) {
    console.error("Erro ao obter Produtos:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getProdutoById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const produtoId = parseInt(req.params.id, 10);
    const produto = await ProdutoRepository.getProdutoById(produtoId);

    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    return res.status(200).json(produto);
  } catch (error) {
    console.error("Erro ao obter Produto por ID:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createProduto = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const produtoData: ProdutoInterface = req.body;

    const existingProduto = await ProdutoRepository.getProdutoNome(
      produtoData.nome
    );

    if (existingProduto) {
      return res.status(400).json({ error: "E-mail já cadastrado" });
    }

    const newProduto = await ProdutoRepository.createProduto(produtoData);

    return res
      .status(201)
      .json({ message: "Produto cadastrado com sucesso", produto: newProduto });
  } catch (error) {
    console.error("Erro ao criar Produto:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteProduto = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const produtoId = parseInt(req.params.id, 10);
    const deleted = await ProdutoRepository.deleteProduto(produtoId);

    if (!deleted) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    return res.status(200).json({ message: "Produto deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir Produto:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateProduto = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const produtoId = parseInt(req.params.id, 10);
    const produtoData: Partial<ProdutoInterface> = req.body;

    const updatedProduto = await ProdutoRepository.updateProduto(
      produtoId,
      produtoData
    );

    if (!updatedProduto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    return res
      .status(200)
      .json({
        message: "Produto atualizado com sucesso",
        produto: updatedProduto,
      });
  } catch (error) {
    console.error("Erro ao atualizar Produto:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default routeProduto;
