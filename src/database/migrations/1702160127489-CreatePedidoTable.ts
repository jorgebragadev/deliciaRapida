import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from "typeorm";


export class CreatePedidoTable1702160127489 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'pedido',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'total',
                    type: 'decimal',
                    precision: 10,
                    scale: 2,
                },
                {
                    name: 'formapagamento',
                    type: 'varchar',
                    default: "'dinheiro'",
                },
                {
                    name: 'status',
                    type: 'varchar',
                    default: "'preparando'",
                },
                {
                    name: 'data',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'clienteId',
                    type: 'int',
                    isNullable: true,
                },
            ],
        }), true);

        await queryRunner.createForeignKey('pedido', new TableForeignKey({
            columnNames: ['clienteId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'cliente',
            onDelete: 'SET NULL',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('pedido');
    }
}