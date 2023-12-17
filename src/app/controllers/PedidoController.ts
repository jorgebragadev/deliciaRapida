import { Request, Response, Router, NextFunction } from "express";
import PedidoInterface from "../interfaces/IPedido";
import PedidoRepository from "../repositories/PedidoRepository";
import ItemPedidoRepository from "../repositories/ItemPedidoRepository";

const routePedido = Router();

export const createPedido = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const pedidoData: PedidoInterface = req.body;
    const newPedido = await PedidoRepository.createPedido(pedidoData);
    return res
      .status(201)
      .json({ message: "Pedido cadastrado com sucesso", pedido: newPedido });
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPedidos = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const pedidos = await PedidoRepository.getPedidos();
    return res.status(200).json(pedidos);
  } catch (error) {
    console.error("Erro ao obter clientes:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getPedidosStatus = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const status = req.params.status;

    const pedidos = await PedidoRepository.getPedidosByStatus(status);

    if (pedidos.length === 0) {
      return res.status(404).json({ error: "Pedidos não encontrados para o status fornecido" });
    }

    const respostaFormatada: any[] = await Promise.all(
      pedidos.map(async (pedido) => {
        if (pedido.id !== undefined) {
          const itemPedidos = await ItemPedidoRepository.getItemPedidoById(pedido.id);

          const itensFormatados = itemPedidos !== undefined
            ? (Array.isArray(itemPedidos)
                ? itemPedidos
                : [itemPedidos]
              ).map((item: any) => ({
                produto: {
                  nome: item.produto.nome,
                  id: item.produto.id,
                },
                quantidade: item.quantidade,
                valorunit: item.valorunit,
                total: item.total,
              }))
            : [];

          const pedidoSimplificado = {
            id: pedido.id,
            total: pedido.total,
            formapagamento: pedido.formapagamento,
            status: pedido.status,
            data: pedido.data,
            cliente: {
              nome: pedido.cliente.nome,
              email: pedido.cliente.email,
              telefone: pedido.cliente.telefone,
            },
            pedidoSolicitado: [
              {
                ItensdoPedido: itensFormatados,
              }
            ],
          };

          return pedidoSimplificado;
        } else {
          console.error("Pedido com ID indefinido encontrado.");
          return {}; 
        }
      })
    );

    return res.status(200).json(respostaFormatada);
  } catch (error) {
    console.error("Erro ao obter Pedidos por Status:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getPedidoById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const pedidoId = parseInt(req.params.id, 10);
    const pedido = await PedidoRepository.getPedidoById(pedidoId);

    if (!pedido) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    return res.status(200).json(pedido);
  } catch (error) {
    console.error("Erro ao obter Pedido por ID:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getFechamentoCaixa = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const dataInicial: Date | undefined = new Date();
  const dataFinal: Date | undefined = new Date();

  const formatarData = (data: Date | undefined): string => {
    return data !== undefined
      ? `${String(data.getDate()).padStart(2, "0")}/${String(
          data.getMonth() + 1
        ).padStart(2, "0")}/${String(data.getFullYear())}`
      : "";
  };
  try {
    let totalDoCaixa = 0;

    const dataInicialParam: string | undefined = req.query.dataInicial as
      | string
      | undefined;
    const dataFinalParam: string | undefined = req.query.dataFinal as
      | string
      | undefined;

    const dataAtual = new Date();

    const dataInicial: Date | undefined = dataInicialParam
      ? new Date(dataInicialParam + "T00:00:00.000")
      : new Date(
          dataAtual.getFullYear(),
          dataAtual.getMonth(),
          dataAtual.getDate(),
          0,
          0,
          0,
          0
        );

    const dataFinal: Date | undefined = dataFinalParam
      ? new Date(dataFinalParam + "T23:59:59.999")
      : undefined;

    const pedidos = await PedidoRepository.getPedidos();

    const pedidosFiltrados = pedidos.filter((pedido) => {
      if (dataInicial && dataFinal) {
        const pedidoData = new Date(pedido.data);
        return pedidoData >= dataInicial && pedidoData <= dataFinal;
      } else if (dataInicial) {
        return (
          new Date(pedido.data).toLocaleDateString() ===
          dataInicial.toLocaleDateString()
        );
      } else if (dataFinal) {
        return (
          new Date(pedido.data).toLocaleDateString() ===
          dataFinal.toLocaleDateString()
        );
      }
      return true;
    });

    const somasPorFormaPagamento: Record<string, string> = {};

    somasPorFormaPagamento["Data Inicial"] = formatarData(dataInicial);
    somasPorFormaPagamento["Data Final"] = formatarData(dataFinal);

    pedidosFiltrados.forEach((pedido) => {
      const formaPagamento = pedido.formapagamento;

      if (!somasPorFormaPagamento[formaPagamento]) {
        somasPorFormaPagamento[formaPagamento] = "0.00";
      }

      const valorAtual = parseFloat(somasPorFormaPagamento[formaPagamento]);
      const valorPedido =
        typeof pedido.total === "number"
          ? pedido.total
          : parseFloat(pedido.total);
      const novoValor = (valorAtual + valorPedido).toFixed(2);

      somasPorFormaPagamento[formaPagamento] = novoValor;

      totalDoCaixa += valorPedido;
    });

    somasPorFormaPagamento["Total do Caixa"] = totalDoCaixa.toFixed(2);

    const objetoResposta = {
      "Fechamento do Caixa": somasPorFormaPagamento,
    };

    return res.status(200).json(objetoResposta);
  } catch (error) {
    console.error("Erro ao obter os Pedidos:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPedidoFechadoById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const pedidoId: number = parseInt(req.params.id, 10);
    const pedido = await PedidoRepository.getPedidoById(pedidoId);

    if (!pedido) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    const pedidoFechado = await getPedidoFechado(pedidoId);

    const pedidoAtualizado = await PedidoRepository.getPedidoById(pedidoId);

    return res.status(200).json({ pedido: pedidoAtualizado, pedidoFechado });
  } catch (error) {
    console.error("Erro ao obter pedido por ID:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPedidoFechado = async (pedidoId: number): Promise<any> => {
  try {
    const itemPedidos = await ItemPedidoRepository.getItemPedidos();

    const pedidosAgrupados: Record<string, any> = {};

    for (const item of itemPedidos) {
      const numeroPedido = item.pedido.id;

      if (numeroPedido === pedidoId) {
        if (!pedidosAgrupados[numeroPedido]) {
          pedidosAgrupados[numeroPedido] = {
            pedido: item.pedido,
            itens: [],
          };
        }

        pedidosAgrupados[numeroPedido].itens.push({
          produto: item.produto,
          quantidade: item.quantidade,
          valorunit: item.valorunit,
          total: item.total,
        });
      }
    }

    const resultadoAgrupado = Object.values(pedidosAgrupados);

    for (const pedido of resultadoAgrupado) {
      const totalPedido = pedido.itens.reduce(
        (total: number, item: any) => total + Number(item.total),
        0
      );
      pedido.pedido.total = totalPedido.toFixed(2);

      try {
        await PedidoRepository.updatePedido(pedido.pedido.id, {
          total: pedido.pedido.total,
        });
      } catch (error) {
        console.error(
          `Erro ao atualizar o pedido ${pedido.pedido.id}: ${error}`
        );
      }
    }

    const respostaFormatada = resultadoAgrupado.map((pedido: any) => ({
      //Pedido: pedido.pedido.id,
      //Cliente: pedido.pedido.cliente.nome,
      //Data: new Date(pedido.pedido.data).toLocaleDateString(),
      //Status: pedido.pedido.status,
      //'Total do Pedido': pedido.pedido.total,
      Itens: pedido.itens.map((item: any) => ({
        Produto: item.produto.nome,
        Quantidade: item.quantidade,
        Subtotal: item.valorunit,
        "Total do Item": item.total,
      })),
    }));

    return respostaFormatada;
  } catch (error) {
    console.error("Erro ao obter Itens do Pedido:", error);
    throw new Error("Internal Server Error");
  }
};

export const deletePedido = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const pedidoId: number = parseInt(req.params.id, 10);
    const deleteResult = await PedidoRepository.deletePedido(pedidoId);

    if (!deleteResult) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    return res.status(200).json({ message: "Pedido excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir pedido:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updatePedido = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const pedidoIdId = parseInt(req.params.id, 10);
    const pedidoData: Partial<PedidoInterface> = req.body;

    const updatedPedido = await PedidoRepository.updatePedido(
      pedidoIdId,
      pedidoData
    );

    if (!updatedPedido) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    return res
      .status(200)
      .json({
        message: "Pedido atualizado com sucesso",
        pedido: updatedPedido,
      });
  } catch (error) {
    console.error("Erro ao atualizar Pedido:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getFormaPagamento = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    const pedidos = await PedidoRepository.getPedidos();

    const pedidosAgrupados: { [formaPagamento: string]: any } = {};
    pedidos.forEach((pedido) => {
      const formaPagamento = pedido.formapagamento;

      if (!pedidosAgrupados[formaPagamento]) {
        pedidosAgrupados[formaPagamento] = {
          formaPagamento: formaPagamento,
          pedidos: [],
        };
      }

      pedidosAgrupados[formaPagamento].pedidos.push(pedido);
    });

    const totaisPorFormaPagamento: { [formaPagamento: string]: number } = {};

    for (const formaPagamento in pedidosAgrupados) {
      const pedidosFormaPagamento = pedidosAgrupados[formaPagamento].pedidos;

      const totalFormaPagamento = pedidosFormaPagamento.reduce(
        (total: number, pedido: any) => {
          const valorPedido = parseFloat(pedido.total) || 0;
          return total + valorPedido;
        },
        0
      );

      const totalFormatado = totalFormaPagamento.toFixed(2);

      totaisPorFormaPagamento[formaPagamento] = totalFormatado;
    }

    return res.status(200).json(totaisPorFormaPagamento);
  } catch (error) {
    console.error("Erro ao obter Pedidos:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default routePedido;
