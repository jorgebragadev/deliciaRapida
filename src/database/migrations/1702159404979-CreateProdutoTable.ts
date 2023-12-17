import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateProdutoTable1702159404979 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'produto',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'preco',
                    type: 'decimal',
                    precision: 10,
                    scale: 2,
                },
                {
                    name: 'nome',
                    type: 'varchar',
                },
                {
                    name: 'estoque',
                    type: 'int',
                },
                {
                    name: 'data',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('produto');
    }
}