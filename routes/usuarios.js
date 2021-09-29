const express = require('express');
const router = express.Router();
const postgres = require('../postgres');
const bcrypt = require('bcrypt');

router.post('/cadastro', (req, res, next) => {
    postgres.query('SELECT * FROM usuarios WHERE email = $1', [req.body.email], (error, result) => {
        if (error) { return res.status(500).send({error: error})}
        if (result.rowCount > 0){
            res.status(409).send({ mensagem: 'Usuário já cadastrado' });
        } else {
            bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
                if (errBcrypt) { return res.status(500).send({ error: errBcrypt }) }
                postgres.query(
                    `INSERT INTO usuarios (email, senha) VALUES ($1, $2) RETURNING id_usuario`, 
                    [req.body.email, hash],
                    (error, result) => {
                    if (error) { return res.status(500).send({error: error})}
                    const response = {
                        mensagem: 'Usuário criado com sucesso',
                        usuarioCriado: {
                            id_usuario: result.rows[0].id_usuario,
                            email: req.body.email
                        }
                    }
                    return res.status(201).send(response);
                });
            });
        }
    });
});

module.exports = router;