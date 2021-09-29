const express = require('express');
const router = express.Router();
const postgres = require('../postgres');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

router.post('/login', (req, res, next) => {
    postgres.query(`SELECT * FROM usuarios WHERE email = $1`, [req.body.email], (error, result) => {
        console.log(result);
        if (error) { return res.status(500).send({error: error})}
        if (result.rowCount < 1) {
            return res.status(401).send({ mensagem: 'Falha na autenticação' });
        }
        bcrypt.compare(req.body.senha, result.rows[0].senha, (error, resultado) => {
            if (error) {
                return res.status(401).send({ mensagem: 'Falha na autenticação' });
            }
            if (resultado) {
                const token = jwt.sign({
                    id_usuario: result.rows[0].id_usuario,
                    email: result.rows[0].email
                }, process.env.JWT_KEY,
                {
                    expiresIn: '1h'
                });            
                return res.status(200).send({
                    mensagem: 'Autenticado com sucesso',
                    token: token
                });
            }
            return res.status(401).send({ mensagem: 'Falha na autenticação' }); 
        });
        
    });    
});

module.exports = router;