import { Request, Response, Router } from "express";
import ClienteRepository from "../repositories/ClienteRepository";
import ClienteInterface from "../interfaces/ICliente";

const routeCliente = Router();

export const getClientes = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    const clientes = await ClienteRepository.getClientes();
    return res.status(200).json(clientes);
  } catch (error) {
    console.error("Erro ao obter clientes:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getClienteById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const clienteId = parseInt(req.params.id, 10);
    const cliente = await ClienteRepository.getClienteById(clienteId);

    if (!cliente) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    return res.status(200).json(cliente);
  } catch (error) {
    console.error("Erro ao obter cliente por ID:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createCliente = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const clienteData: ClienteInterface = req.body;

    const existingCliente = await ClienteRepository.getClienteyEmail(
      clienteData.email
    );

    if (existingCliente) {
      return res
        .status(400)
        .json({ error: "Cliente já cadastrado com este E-mail" });
    }

    const newCliente = await ClienteRepository.createCliente(clienteData);

    return res
      .status(201)
      .json({ message: "Cliente cadastrado com sucesso", cliente: newCliente });
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteCliente = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const clienteId = parseInt(req.params.id, 10);
    const deleted = await ClienteRepository.deleteCliente(clienteId);

    if (!deleted) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    return res.status(200).json({ message: "Cliente deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir cliente:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateCliente = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const clienteId = parseInt(req.params.id, 10);
    const clienteData: Partial<ClienteInterface> = req.body;

    const updatedCliente = await ClienteRepository.updateCliente(
      clienteId,
      clienteData
    );

    if (!updatedCliente) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    return res.status(200).json({
      message: "Cliente atualizado com sucesso",
      cliente: updatedCliente,
    });
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default routeCliente;
