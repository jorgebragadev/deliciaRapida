import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from "typeorm";


export class CreateItemPedidooTable1702161649251 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'item_pedido',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'valorunit',
                    type: 'decimal',
                    precision: 10,
                    scale: 2,
                },
                {
                    name: 'total',
                    type: 'decimal',
                    precision: 10,
                    scale: 2,
                },
                {
                    name: 'quantidade',
                    type: 'int',
                },
                {
                    name: 'pedidoId',
                    type: 'int',
                    isNullable: true,
                },
                {
                    name: 'produtoId',
                    type: 'int',
                    isNullable: true,
                },
            ],
        }), true);

        await queryRunner.createForeignKey('item_pedido', new TableForeignKey({
            columnNames: ['pedidoId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'pedido',
            onDelete: 'SET NULL',
        }));

        await queryRunner.createForeignKey('item_pedido', new TableForeignKey({
            columnNames: ['produtoId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'produto',
            onDelete: 'SET NULL',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('item_pedido');
    }
}