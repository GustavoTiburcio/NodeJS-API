const express = require('express');
const router = express.Router();
const postgres = require('../postgres');

// RETORNA TODOS OS PRODUTOS
router.get('/', (req, res, next) =>{
    postgres.query('SELECT * FROM produtos ORDER BY id', (error, result) => {
        if (error) {
            return res.status(500).send({
                error: error
            });
        }
        console.log(result)
        const response = {
            totalDeRegistros: result.rowCount,
            produtos: result.rows.map(prod => {
                return {
                    id_produto: prod.id,
                    nome: prod.nome,
                    preco: prod.preco,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna todos os produtos',
                        url: 'http://localhost:3000/produtos/' + prod.id
                    }
                }
            })
        }
        res.status(200).send(response);
      })
});

//INSERE UM PRODUTO
router.post('/', (req, res, next) => {
    postgres.query('INSERT INTO produtos (nome, preco) VALUES ($1, $2) RETURNING id',[req.body.nome, req.body.preco], (error, result) => {
        if (error) {
            return res.status(500).send({
                error: error
            });
        }
        console.log(result)
        const response = {
            mensagem: 'Produto inserido com sucesso',
            produtoCriado:{
                id_produto: result.rows[0].id,
                nome: req.body.nome,
                preco: req.body.preco,
                request: {
                    tipo: 'POST',
                    descricao: 'Insere um produto',
                    url: 'http://localhost:3000/produtos'
                }
            }
        }
        res.status(201).send(response);
      });
});

//RETORNA OS DADOS DE UM PRODUTO
router.get('/:id_produto', (req, res, next) => {
    //const id = req.params.id_produto;
    postgres.query('SELECT * FROM produtos WHERE id = $1', [req.params.id_produto],(error, result) => {
        if (error) {
            return res.status(500).send({
                error: error
            });
        }
        console.log(result)
        if (result.rowCount == 0) {
            return res.status(404).send({
                mensagem: 'Não foi encontrado produto com esse ID'
            });
        }
        const response = {
            produto:{
                id_produto: result.rows[0].id,
                nome: result.rows[0].nome,
                preco: result.rows[0].preco,
                request: {
                    tipo: 'GET',
                    descricao: 'Retorna um produto',
                    url: 'http://localhost:3000/produtos'
                }
            }
        }
        const resultado = result.rows;
        res.status(200).send(response);
      })
});

//ALTERA UM PRODUTO
router.patch('/', (req, res, next) => {
    postgres.query('UPDATE produtos SET nome = $1, preco = $2 WHERE id = $3', [req.body.nome, req.body.preco, req.body.id_produto],(error, result) => {
        if (error) {
            return res.status(500).send({
                error: error
            });
        }
        console.log(result)
        res.status(202).send({
                mensagem: 'produto alterado com sucesso'
             });
      })
});

//EXCLUI UM PRODUTO
router.delete('/', (req, res, next) => {
    postgres.query('DELETE FROM produtos WHERE id = $1', [req.body.id_produto],(error, result) => {
        if (error) {
            return res.status(500).send({
                error: error
            });
        }
        console.log(result)
        res.status(202).send({
                mensagem: 'produto excluído com sucesso'
             });
      })
});

module.exports = router;