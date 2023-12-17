import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("produto")
export default class Produto {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    preco: number;

    @Column({ type: 'varchar' })
    nome: string;

    @Column({ type: 'int' })
    estoque: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    data: Date;

    constructor(preco: number, nome: string, estoque: number) {
        this.preco = preco;
        this.nome = nome;
        this.estoque = estoque;
        this.data = new Date();
    }

    // Getters and Setters
    getId(): number {
        return this.id;
    }

    getPreco(): number {
        return this.preco;
    }

    setPreco(preco: number): void {
        this.preco = preco;
    }

    getNome(): string {
        return this.nome;
    }

    setNome(nome: string): void {
        this.nome = nome;
    }

    getEstoque(): number {
        return this.estoque;
    }

    setEstoque(estoque: number): void {
        this.estoque = estoque;
    }

    getData(): Date {
        return this.data;
    }

    setData(data: Date): void {
        this.data = data;
    }
}
