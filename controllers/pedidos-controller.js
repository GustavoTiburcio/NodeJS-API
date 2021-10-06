const postgres = require('../postgres');

exports.getPedidos = (req, res, next) =>{
    postgres.query(
        `SELECT pedidos.id,
                pedidos.quantidade,
                produtos.id as id_produto,
                produtos.nome,
                produtos.preco
           FROM pedidos
     INNER JOIN produtos
             ON produtos.id = pedidos.id_produto_fk
       ORDER BY pedidos.id;`
    , (error, result) => {
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
                    quantidade: pedido.quantidade,
                    produto:{
                        id_produto: pedido.id_produto,
                        nome: pedido.nome,
                        preco: pedido.preco
                    },                 
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna os detalhes de um pedido específico',
                        url: 'https://rest-api-tiburcio.herokuapp.com/pedido/' + pedido.id
                    }
                }
            })
        }
        return res.status(200).send(response);
      })
};

exports.postPedido = (req, res, next) => {
    postgres.query('SELECT * FROM produtos where id = $1',[req.body.id_produto], (error, result) => {
        if (error) {
            return res.status(500).send({
                error: error
            });
        }
        if (result.rowCount == 0) {
            return res.status(404).send({
                mensagem: 'Produto não encontrado'
            });
        }
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
                        url: 'https://rest-api-tiburcio.herokuapp.com/pedidos'
                    }
                }
            }
            return res.status(201).send(response);
          });
    });
};

exports.getPedido = (req, res, next) => {
    postgres.query('SELECT * FROM pedidos WHERE id = $1', [req.params.id_pedido], (error, result) => {
        if (error) {
            return res.status(500).send({
                error: error
            });
        }
        console.log(result)
        if (result.rowCount == 0) {
            return res.status(404).send({
                mensagem: 'Não foi encontrado nenhum pedido com esse ID'
            });
        }
        const response = {
            pedido:{
                id_pedido: result.rows[0].id,
                id_produto: result.rows[0].id_produto_fk,
                quantidade: result.rows[0].quantidade,
                request: {
                    tipo: 'GET',
                    descricao: 'Retorna todos os pedidos',
                    url: 'https://rest-api-tiburcio.herokuapp.com/pedidos'
                }
            }
        }
        const resultado = result.rows;
        return res.status(200).send(response);
      })
};

exports.deletePedido = (req, res, next) => {
    postgres.query('DELETE FROM pedidos WHERE id = $1', [req.body.id_pedido], (error, result) => {
        if (error) {
            return res.status(500).send({
                error: error
            });
        }
        console.log(result)
        const response = {
            mensagem: 'Pedido removido com sucesso',
            request: {
                tipo: 'POST',
                descricao: 'Insere um pedido',
                url: 'https://rest-api-tiburcio.herokuapp.com/pedidos',
                body: {
                    id_produto: 'Number',
                    quantidade: 'Number'
                }
            }
        }
        return res.status(202).send(response);
      })
};