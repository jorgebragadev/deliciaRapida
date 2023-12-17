import { Request, Response, Router } from 'express';
import ItemPedidoInterface from '../interfaces/IItemPedido';
import ItemPedidoRepository from '../repositories/ItemPedidoRepository';
import ProdutoRepository from '../repositories/ProdutoRepository';


const routeItemPedido = Router();



export const createItemPedido = async (req: Request, res: Response): Promise<Response> => {
    try {
        const itemPedidoData: ItemPedidoInterface = req.body;

        // Acesse a quantidade do itemPedidoData
        const quantidadePedido = itemPedidoData.quantidade;

        // Certifique-se de que produtoId é do tipo number
        const produtoId = itemPedidoData.produto;

        if (typeof produtoId !== 'number') {
            throw new Error('ID do produto não é um número válido.');
        }

        // Obtenha o produto do banco de dados usando o produtoId do itemPedidoData
        const produto = await ProdutoRepository.getProdutoById(produtoId);

        // Verifique se há estoque suficiente
        if (!produto || quantidadePedido > produto.estoque) {
            throw new Error('Produto não encontrado ou quantidade solicitada maior do que o estoque disponível.');
        }

        // Calcule o novo estoque
        const estoqueAtual = produto.estoque;
        if (estoqueAtual === undefined) {
            throw new Error('Estoque do produto não está definido.');
        }

        const novoEstoque = estoqueAtual - quantidadePedido;

        // Atualize o objeto itemPedidoData com o total calculado e novoEstoque
        const newItemPedidoData: ItemPedidoInterface & { estoque: number } = {
            ...itemPedidoData,
            total: Number((itemPedidoData.valorunit * quantidadePedido).toFixed(2)),
            estoque: novoEstoque,
        };

        // Atualize o produto no banco de dados com o novo estoque
        await ProdutoRepository.updateProduto(produtoId, { estoque: novoEstoque });

        // Crie o ItemPedido com o total calculado
        const newItemPedido = await ItemPedidoRepository.createItemPedido(newItemPedidoData);

        return res.status(201).json({ message: 'Item do Pedido cadastrado com sucesso', itemPedido: newItemPedido });
    } catch (error) {
        console.error('Erro ao criar Item do Pedido:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

  export const getItemPedidos = async (_req: Request, res: Response): Promise<Response> => {
    try {
        const itemPedidos = await ItemPedidoRepository.getItemPedidos();

        // Mapeia os resultados para incluir apenas as informações desejadas
        const resultadoMapeado = itemPedidos.map((itemPedido) => ({
            id: itemPedido.id,
            pedido: itemPedido.pedido.id,
            Produto: {
                id: itemPedido.produto.id,
                nome: itemPedido.produto.nome, 
            },
            valorunit: itemPedido.valorunit,
            quantidade: itemPedido.quantidade,
            total: itemPedido.total,
        }));

        return res.status(200).json(resultadoMapeado);
    } catch (error) {
        console.error('Erro ao obter Produtos:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

  export const getItemPedidoById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const itemPedidoId: number = parseInt(req.params.id, 10);
        const itemPedido = await ItemPedidoRepository.getItemPedidoById(itemPedidoId);

        if (!itemPedido) {
            return res.status(404).json({ error: 'Item do Pedido não encontrado' });
        }

        return res.status(200).json(itemPedido);
    } catch (error) {
        console.error('Erro ao obter pedido por ID:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteItemPedido = async (req: Request, res: Response): Promise<Response> => {
    try {
        const itemPedidoId: number = parseInt(req.params.id, 10);

        // Obtenha as informações do itemPedido a ser excluído
        const itemPedido = await ItemPedidoRepository.getItemPedidoById(itemPedidoId);

        if (!itemPedido) {
            return res.status(404).json({ error: 'Item do Pedido não encontrado' });
        }

        const produtoId = itemPedido.produto.id;
        const quantidadeExcluida = itemPedido.quantidade;

        // Exclua o itemPedido do banco de dados
        const deleteResult = await ItemPedidoRepository.deleteItemPedido(itemPedidoId);

        if (!deleteResult) {
            return res.status(404).json({ error: 'Item do Pedido não encontrado' });
        }

        // Atualize o estoque do produto adicionando a quantidade excluída de volta
        const produto = await ProdutoRepository.getProdutoById(produtoId);
        if (!produto) {
            console.error(`Produto com ID ${produtoId} não encontrado.`);
            throw new Error(`Produto com ID ${produtoId} não encontrado.`);
        }

        const novoEstoque = (produto.estoque ?? 0) + quantidadeExcluida;

        await ProdutoRepository.updateProduto(produtoId, { estoque: novoEstoque });

        return res.status(200).json({ message: 'Item do Pedido excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir Item do Pedido:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateItemPedido = async (req: Request, res: Response): Promise<Response> => {
    try {
        const itemPedidoIdId = parseInt(req.params.id, 10);
        const itemPedidoData: Partial<ItemPedidoInterface> = req.body;

        const updatedItemPedido = await ItemPedidoRepository.updateItemPedido(itemPedidoIdId, itemPedidoData);

        if (!updatedItemPedido) {
            return res.status(404).json({ error: 'Item do Pedido não encontrado' });
        }

        return res.status(200).json( {message: 'Item do Pedido atualizado com sucesso', itemPedido: updatedItemPedido });
    } catch (error) {
        console.error('Erro ao atualizar Item do Pedido:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export default routeItemPedido;