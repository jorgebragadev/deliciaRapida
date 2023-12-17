import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import Cliente from "./Cliente";

@Entity("pedido")
export default class Pedido {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total: number;

    @Column({ type: 'varchar', default: 'dinheiro' })
    formapagamento: string;

    @Column({ type: 'varchar', default: 'preparando' })
    status: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    data: Date;

    @ManyToOne(() => Cliente, { nullable: true, eager: true })
    @JoinColumn({ name: 'clienteId' })
    cliente: Cliente;

    constructor(total: number, formapagamento: string, status: string, data: Date, cliente: Cliente) {
        this.total = total;
        this.formapagamento = formapagamento;
        this.status = status;
        this.data = new Date();
        this.cliente = cliente;
    }


    getTotal(): number {
        return this.total;
    }

    setTotal(total: number): void {
        this.total = total;
    }

    getFormaPagamento(): string {
        return this.formapagamento;
    }

    setFormaPagamento(formapagamento: string): void {
        this.formapagamento = formapagamento;
    }

    getStatus(): string {
        return this.status;
    }

    setStatus(status: string): void {
        this.status = status;
    }

    getData(): Date {
        return this.data;
    }

    setData(data: Date): void {
        this.data = data;
    }

    getCliente(): Cliente {
        return this.cliente;
    }

    setCliente(cliente: Cliente): void {
        this.cliente = cliente;
    }
}
