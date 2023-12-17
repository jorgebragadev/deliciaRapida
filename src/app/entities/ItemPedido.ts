import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import Pedido from "./Pedido";
import Produto from "./Produto";

@Entity("item_pedido")
export default class ItemPedido {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    valorunit: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total: number;

    @Column({ type: 'int' })
    quantidade: number;

    @ManyToOne(() => Pedido, { nullable: true, eager: true })
    @JoinColumn({ name: 'pedidoId' })
    pedido: Pedido;

    @ManyToOne(() => Produto, { nullable: true, eager: true })
    @JoinColumn({ name: 'produtoId' })
    produto: Produto;

    constructor(valorunit: number, total: number, quantidade: number, pedido: Pedido, produto: Produto) {
        this.valorunit = valorunit;
        this.total = total;
        this.quantidade = quantidade;
        this.pedido = pedido;
        this.produto = produto;
    }

    getValorUnit(): number {
        return this.valorunit;
    }

    setValorUnit(valorunit: number): void {
        this.valorunit = valorunit;
    }

    getTotal(): number {
        return this.total;
    }

    setTotal(total: number): void {
        this.total = total;
    }

    getQuantidade(): number {
        return this.quantidade;
    }

    setQuantidade(quantidade: number): void {
        this.quantidade = quantidade;
    }

    getPedido(): Pedido {
        return this.pedido;
    }

    setPedido(pedido: Pedido): void {
        this.pedido = pedido;
    }

    getProduto(): Produto {
        return this.produto;
    }

    setProduto(produto: Produto): void {
        this.produto = produto;
    }
}
