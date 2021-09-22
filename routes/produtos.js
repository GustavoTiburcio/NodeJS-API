const express = require('express');
const router = express.Router();
const postgres = require('../postgres');

// RETORNA TODOS OS PRODUTOS
router.get('/', (req, res, next) =>{
    postgres.query('SELECT * from produtos', (error, resp) => {
        if (error) {
            return res.status(500).send({
                error: error,
                response: null
            });
        }
        console.log(resp)
        const response = resp.rows;
        res.status(200).send({
                 response
             });
      })
});

//INSERE UM PRODUTO
router.post('/', (req, res, next) => {
    postgres.query('INSERT INTO produtos (nome, preco) VALUES ($1, $2)',[req.body.nome, req.body.preco], (error, resp) => {
        if (error) {
            return res.status(500).send({
                error: error,
                response: null
            });
        }
        console.log(resp)
        res.status(201).send({
                 mensagem: 'Produto inserido com sucesso'
             });
      });
});

//RETORNA OS DADOS DE UM PRODUTO
router.get('/:id_produto', (req, res, next) => {
    //const id = req.params.id_produto;
    postgres.query('SELECT * from produtos where id = $1', [req.params.id_produto],(error, resp) => {
        if (error) {
            return res.status(500).send({
                error: error,
                response: null
            });
        }
        console.log(resp)
        const response = resp.rows;
        res.status(200).send({
                 response
             });
      })
});

//ALTERA UM PRODUTO
router.patch('/:id_produto', (req, res, next) => {
    postgres.query('UPDATE produtos set nome = $2, preco = $3 where id = $1', [req.params.id_produto, req.body.nome, req.body.preco],(error, resp) => {
        if (error) {
            return res.status(500).send({
                error: error,
                response: null
            });
        }
        console.log(resp)
        res.status(200).send({
                mensagem: 'produto alterado'
             });
      })
});

//EXCLUI UM PRODUTO
router.delete('/:id_produto', (req, res, next) => {
    postgres.query('DELETE from produtos where id = $1', [req.params.id_produto],(error, resp) => {
        if (error) {
            return res.status(500).send({
                error: error,
                response: null
            });
        }
        console.log(resp)
        res.status(200).send({
                mensagem: 'produto excluído'
             });
      })
});

module.exports = router;