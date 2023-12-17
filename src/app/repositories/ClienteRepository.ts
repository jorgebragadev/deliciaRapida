import Cliente from "../entities/Cliente";
import ClienteInterface from "../interfaces/ICliente";
import { AppDataSource } from "../../database/data-source";

const ClienteRepository = AppDataSource.getRepository(Cliente);

const createCliente = async (
  clienteData: ClienteInterface
): Promise<ClienteInterface> => {
  const newCliente = ClienteRepository.create(clienteData);
  const savedCliente = await ClienteRepository.save(newCliente);
  return savedCliente;
};

const getClientes = (): Promise<ClienteInterface[]> => {
  return ClienteRepository.find() as Promise<ClienteInterface[]>;
};

const getClienteById = async (
  clienteId: number
): Promise<ClienteInterface | undefined> => {
  const Cliente = await ClienteRepository.findOne({ where: { id: clienteId } });

  return Cliente || undefined;
};

const getClienteyEmail = async (
  email: string
): Promise<Cliente | undefined> => {
  const Cliente = await ClienteRepository.findOne({ where: { email } });
  return Cliente || undefined;
};

const deleteCliente = async (clienteId: number): Promise<boolean> => {
  const deleteResult = await ClienteRepository.delete(clienteId);
  return deleteResult.affected === 1;
};

const updateCliente = async (
  clienteId: number,
  clienteData: Partial<ClienteInterface>
): Promise<ClienteInterface | undefined> => {
  let cliente = await ClienteRepository.findOne({ where: { id: clienteId } });

  if (!cliente) {
    return undefined;
  }

  cliente.nome = clienteData.nome || cliente.nome;
  cliente.email = clienteData.email || cliente.email;
  cliente.telefone = clienteData.telefone || cliente.telefone;

  cliente = await ClienteRepository.save(cliente);

  return cliente;
};

export default {
  createCliente,
  getClientes,
  getClienteById,
  getClienteyEmail,
  updateCliente,
  deleteCliente,
};
