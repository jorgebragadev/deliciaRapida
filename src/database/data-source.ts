import "reflect-metadata"
import { DataSource } from "typeorm"
import { CreateClienteTable1702118904211 } from './migrations/1702118904211-CreateClienteTable'
import Cliente from "../app/entities/Cliente"
import Produto from "../app/entities/Produto"
import { CreateProdutoTable1702159404979 } from "./migrations/1702159404979-CreateProdutoTable"
import Pedido from "../app/entities/Pedido"
import { CreatePedidoTable1702160127489 } from "./migrations/1702160127489-CreatePedidoTable"
import ItemPedido from "../app/entities/ItemPedido"
import { CreateItemPedidooTable1702161649251 } from "./migrations/1702161649251-CreateItemPedidoTable"


export const AppDataSource = new DataSource({
    type: "mysql",
    host: "ccn.h.filess.io",
    port: 3307,
    username: "lanchonete_causeturn",
    password: "2e96e242de091de055508a2379595efab5c11547",
    database: "lanchonete_causeturn",
    synchronize: true,
    logging: false,
    entities: [Cliente, Produto, Pedido, ItemPedido],
    migrations: [CreateClienteTable1702118904211, CreateProdutoTable1702159404979, CreatePedidoTable1702160127489, CreateItemPedidooTable1702161649251],
    subscribers: [],
})
