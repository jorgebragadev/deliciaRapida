import Cliente from "../entities/Cliente";


interface IPedido {
    id?: number;
    total: number; 
    formapagamento: string; 
    status: string; 
    data: Date;
    cliente: Cliente;
    dataInicial?: Date;
    dataFinal?: Date;
}

export default IPedido;