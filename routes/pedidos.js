const express = require('express');
const router = express.Router();
const postgres = require('../postgres');

// RETORNA TODOS OS PEDIDOS
router.get('/', (req, res, next) =>{
    postgres.query('SELECT * FROM pedidos ORDER BY id', (error, result) => {
        if (error) {
            return res.status(500).send({
                error: error
            });
        }
        console.log(result)
        const response = {
            totalDeRegistros: result.rowCount,
            pedidos: result.rows.map(pedido => {
                return {
                    id_pedido: pedido.id,
                    id_produto: pedido.id_produto_fk,
                    quantidade: pedido.quantidade,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna os detalhes de um pedido específico',
                        url: 'http://localhost:3000/pedido/' + pedido.id
                    }
                }
            })
        }
        return res.status(200).send(response);
      })
});

//INSERE UM PEDIDO
router.post('/', (req, res, next) => {
    postgres.query('INSERT INTO pedidos (quantidade, id_produto_fk) VALUES ($1, $2) RETURNING id',[req.body.quantidade, req.body.id_produto], (error, result) => {
        if (error) {
            return res.status(500).send({
                error: error
            });
        }
        console.log(result)
        const response = {
            mensagem: 'Pedido inserido com sucesso',
            pedidoCriado:{
                id_pedido: result.rows[0].id,
                id_produto: req.body.id_produto,
                quantidade: req.body.quantidade,
                request: {
                    tipo: 'GET',
                    descricao: 'Retorna todos os pedidos',
                    url: 'http://localhost:3000/pedidos'
                }
            }
        }
        return res.status(201).send(response);
      });
});

//RETORNA OS DADOS DE UM PEDIDO
router.get('/:id_pedido', (req, res, next) => {
    const id = req.params.id_pedido;

        res.status(200).send({
            mensagem: 'Detalhes do Pedido',
            id_pedido: id
        });
});

//EXCLUI UM PEDIDO
router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Pedido excluído'
    });
});

module.exports = router;