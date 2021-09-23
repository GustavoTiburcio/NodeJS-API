const express = require('express');
const router = express.Router();
const postgres = require('../postgres');
const multer =  require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function( req, file, cb ){
        let data = new Date().toISOString().replace(/:/g, '-') + '-';
        cb(null, data + file.originalname );
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else{
        cb(null, false);
    }
}

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

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
                    imagem_produto: prod.imagem_produto,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna os detalhes de um produto específico',
                        url: 'http://localhost:3000/produtos/' + prod.id
                    }
                }
            })
        }
        return res.status(200).send(response);
      })
});

//INSERE UM PRODUTO
router.post('/', upload.single('imagem_produto'),(req, res, next) => {
    console.log(req.file);
    postgres.query('INSERT INTO produtos (nome, preco, imagem_produto) VALUES ($1, $2, $3) RETURNING id',[req.body.nome, req.body.preco, req.file.path], (error, result) => {
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
                imagem_produto: req.file.path,
                request: {
                    tipo: 'GET',
                    descricao: 'Retorna todos os produtos',
                    url: 'http://localhost:3000/produtos'
                }
            }
        }
        return res.status(201).send(response);
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
                imagem_produto: result.rows[0].imagem_produto,
                request: {
                    tipo: 'GET',
                    descricao: 'Retorna todos os produtos',
                    url: 'http://localhost:3000/produtos'
                }
            }
        }
        const resultado = result.rows;
        return res.status(200).send(response);
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
        const response = {
            mensagem: 'Produto atualizado com sucesso',
            produtoAtualizado:{
                id_produto: req.body.id_produto,
                nome: req.body.nome,
                preco: req.body.preco,
                request: {
                    tipo: 'GET',
                    descricao: 'Retorna os detalhes de um produto em especifico',
                    url: 'http://localhost:3000/produtos/' + req.body.id_produto
                }
            }
        }
        return res.status(202).send(response);
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
        const response = {
            mensagem: 'Produto removido com sucesso',
            request: {
                tipo: 'POST',
                descricao: 'Insere um produto',
                url: 'http://localhost:3000/produtos',
                body: {
                    nome: 'String',
                    preco: 'Number'
                }
            }
        }
        return res.status(202).send(response);
      })
});

module.exports = router;