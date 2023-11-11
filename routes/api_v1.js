const express = require('express');
const router = express.Router();
const sqlDB = require('../mysql/sqlDB');
const upload = require('../storage');

router.get('/api/producto', (req, res) => {

    let sql = "select * from producto";
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

router.get('/api/producto/:filtro', (req, res) => {

    let filtro = req.params.filtro;
    let sql = "select * from producto where nombre_producto like '%" + filtro + "%'";
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

router.post('/api/producto', upload.single('file'), (req, res) => {

    let nombre = req.body.nombre;
    let precio = req.body.precio;
    let imagen = req.file.filename;
    let sql = "insert into producto (nombre_producto, precio_producto, img_producto) values ('" + nombre + "', '" + precio + "', '" + imagen + "')";
    
    sqlDB(sql, function (err, rows) {

        let sql2 = "insert into stock (cantidad_stock, id_producto) values (0, " + rows.insertId + ")";

        sqlDB(sql2, function (err, rows2) {
            res.json(rows2);
        });

    });

});

router.put('/api/producto/:id', (req, res) => {

    let id = req.params.id;
    let nombre = req.body.nombre;
    let precio = req.body.precio;
    let sql = "update producto set nombre_producto='" + nombre + "', precio_producto='" + precio + "' where id_producto=" + id;
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

router.put('/api/producto/:id/imagen', upload.single('file'), (req, res) => {

    let id = req.params.id;
    let nombre = req.body.nombre;
    let precio = req.body.precio;
    let imagen = req.file.filename;
    let sql = "update producto set nombre_producto='" + nombre + "', precio_producto='" + precio + "', img_producto='" + imagen + "' where id_producto=" + id;
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

router.delete('/api/producto/:id', (req, res) => {

    let id = req.params.id;
    let sql = "delete from producto where id_producto=" + id;
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

router.get('/api/stock', (req, res) => {

    let sql = "select * from stock s inner join producto p on s.id_producto=p.id_producto";
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

router.put('/api/stock/:id', (req, res) => {

    let id = req.params.id;
    let stock = req.body.stock;
    let sql = "update stock set cantidad_stock=" + stock + " where id_producto=" + id;
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

module.exports = router;