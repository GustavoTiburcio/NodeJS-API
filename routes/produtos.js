const express = require('express');
const router = express.Router();
const postgres = require('../postgres');

// RETORNA TODOS OS PRODUTOS
router.get('/', (req, res, next) =>{
    res.status(200).send({
        mensagem: 'retornar todos os produtos'
    });
});

//INSERE UM PRODUTOS
router.post('/', (req, res, next) => {
    async function postPed(){
        try {
            console.log('iniciando conexão')
            await postgres.connect();
            console.log('Conexão feita')
            const resultado = await postgres.query('INSERT INTO produtos (nome, preco) VALUES ($1, $2)',[req.body.nome, req.body.preco])
        } catch (ex) {
            console.log('Ocorreu um erro' + ex)
        } finally{
            await postgres.end()
            console.log('Desconectou do banco')
        }
    }
    postPed();
    // postgres.connect(() => {
    //     postgres.query(  
    //          'INSERT INTO produtos (nome, preco) VALUES ($1, $2)',
    //          [req.body.nome, req.body.preco])
    //         .then((error, results) => {
    //         //     if (error) {
    //         //         return res.status(500).send({
    //         //              error: error,
    //         //              response: null
    //         //        });
    //         //    }
    //             console.log(results)           
    //             res.status(201).send({
    //                      mensagem: 'Produto inserido com sucesso',
    //                      //id_produto: results.insertId
    //                  }); 
    //         })
    //         .finally(() => postgres.end());  
    // });   
});

//RETORNA OS DADOS DE UM PRODUTO
router.get('/:id_produto', (req, res, next) => {
    const id = req.params.id_produto;

    if (id === 'especial') {
        res.status(200).send({
            mensagem: 'Você descobriu o ID especial',
            id: id
        });
    } else {
        res.status(200).send({
            mensagem: 'Você passou um ID'
        })
    }
});

//ALTERA UM PRODUTO
router.patch('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'produto alterado'
    });
});

//EXCLUI UM PRODUTO
router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'produto excluído'
    });
});

module.exports = router;