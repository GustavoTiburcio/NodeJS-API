const express = require('express');
const router = express.Router();

// RETORNA TODOS OS PRODUTOS
router.get('/', (req, res, next) =>{
    res.status(200).send({
        mensagem: 'retornar todos os produtos'
    });
});

//INSERE UM PRODUTOS
router.post('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Insere um produto'
    });
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