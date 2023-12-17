import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("cliente")
export default class Cliente {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    nome: string;

    @Column({ type: 'varchar' })
    email: string;

    @Column({ type: 'varchar' })
    telefone: string;

    constructor(nome: string, email: string, telefone: string) {
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
    }


    getNome(): string {
        return this.nome;
    }

    setNome(nome: string): void {
        this.nome = nome;
    }

    getEmail(): string {
        return this.email;
    }

    setEmail(email: string): void {
        this.email = email;
    }

    getTelefone(): string {
        return this.telefone;
    }

    setTelefone(telefone: string): void {
        this.telefone = telefone;
    }
}
