import { Router } from "express";
import { createCliente, deleteCliente, getClienteById, getClientes, updateCliente } from "../controllers/ClienteController";
import { createProduto, deleteProduto, getProdutoById, getProdutos, updateProduto } from "../controllers/ProdutoController";
import { createPedido, deletePedido, getFechamentoCaixa, getPedidoById, getPedidoFechado, getPedidoFechadoById, getPedidos, getPedidosStatus, updatePedido } from "../controllers/PedidoController";
import { createItemPedido, deleteItemPedido, getItemPedidoById, getItemPedidos, updateItemPedido } from "../controllers/ItemPedidoController";

const routers = Router();

//Rotas do Cliente
routers.get('/clientes',  getClientes); //http://localhost:3001/clientes
routers.get('/cliente/:id', getClienteById); //http://localhost:3001/cliente/1
routers.post('/cliente', createCliente); //http://localhost:3001/cliente
routers.put('/cliente/:id', updateCliente); //http://localhost:3001/cliente/1
routers.delete('/cliente/:id', deleteCliente); //http://localhost:3001/cliente/1

//Rotas do Produto
routers.get('/produtos',  getProdutos); //http://localhost:3001/produtos
routers.get('/produto/:id', getProdutoById); //http://localhost:3001/produto/1
routers.post('/produto', createProduto); //http://localhost:3001/produto
routers.put('/produto/:id', updateProduto); //http://localhost:3001/produto/1
routers.delete('/produto/:id', deleteProduto); //http://localhost:3001/produto/1

//Rotas do Pedido
routers.get('/pedidos',  getPedidos); //http://localhost:3001/pedidos
routers.get('/pedido/:id', getPedidoById); //http://localhost:3001/pedido/2
routers.post('/pedido', createPedido); //http://localhost:3001/pedido
routers.put('/pedido/:id', updatePedido); //http://localhost:3001/pedido/2
routers.delete('/pedido/:id', deletePedido); //http://localhost:3001/pedido/4

routers.get('/pedidofechado/:id', getPedidoFechadoById); //http://localhost:3001/pedidofechado/2
routers.get('/fechamentocaixa', getFechamentoCaixa); //http://localhost:3001/fechamentocaixa?dataInicial=2023-12-14&dataFinal=2023-12-14
routers.get('/pedidos/:status', getPedidosStatus); //http://localhost:3001/pedidos/entregue


//Rotas do Item do Pedido
routers.get('/itenspedidos',  getItemPedidos); //http://localhost:3001//itenspedidos
routers.get('/itempedido/:id', getItemPedidoById); //http://localhost:3001/itenspedido/1
routers.post('/itempedido', createItemPedido); //http://localhost:3001/itenspedido
routers.put('/itempedido/:id', updateItemPedido); //http://localhost:3001/itenspedido/1
routers.delete('/itempedido/:id', deleteItemPedido); //http://localhost:3001/itenspedido/1

export default routers;


