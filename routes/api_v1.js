const express = require('express');
const router = express.Router();
const sqlDB = require('../mysql/sqlDB');
const upload = require('../storage');

/* PRODUCTO */

router.get('/api/producto', (req, res) => {

    let sql = "select p.*, c.nombre_categoria from producto p left join categoria c on p.id_categoria=c.id_categoria";
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

router.get('/api/producto/tienda', (req, res) => {

    let sql = "select p.*, s.cantidad_stock, 1 as cantidad_carro, p.precio_producto as total from producto p inner join stock s on p.id_producto=s.id_producto where s.cantidad_stock>0";
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

router.get('/api/producto/buscar/:busqueda', (req, res) => {

    let busqueda = req.params.busqueda;
    let sql = "select p.*, c.nombre_categoria from producto p left join categoria c on p.id_categoria=c.id_categoria where p.nombre_producto like '%" + busqueda + "%'";
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

router.post('/api/producto', upload.single('file'), (req, res) => {

    let nombre = req.body.nombre;
    let precio = req.body.precio;
    let stock = req.body.stock;
    let imagen = req.file.filename;
    let categoria = req.body.categoria;
    let sql = "insert into producto (nombre_producto, precio_producto, img_producto, id_categoria) values ('" + nombre + "', '" + precio + "', '" + imagen + "', '" + categoria + "')";
    
    sqlDB(sql, function (err, rows) {

        let sql2 = "insert into stock (cantidad_stock, id_producto) values (" + stock + ", " + rows.insertId + ")";

        sqlDB(sql2, function (err, rows2) {

            let f = new Date();
            let fecha = f.getFullYear() + "-" + (f.getMonth()+1) + "-" + f.getDate() + " " + f.getHours() + ":" + f.getMinutes();

            let sql3 = "insert into historial (tipo_historial, cantidad_historial, fecha_historial, id_producto) values ('Entrada', " + stock + ", '" + fecha + "', " + rows.insertId + ")";

            sqlDB(sql3, function (err, rows3) {
                res.json(rows3);
            });
        });

    });

});

router.put('/api/producto/:id', (req, res) => {

    let id = req.params.id;
    let nombre = req.body.nombre;
    let precio = req.body.precio;
    let categoria = req.body.categoria;
    let sql = "update producto set nombre_producto='" + nombre + "', precio_producto='" + precio + "', id_categoria='" + categoria + "' where id_producto=" + id;
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

router.put('/api/producto/:id/imagen', upload.single('file'), (req, res) => {

    let id = req.params.id;
    let nombre = req.body.nombre;
    let precio = req.body.precio;
    let imagen = req.file.filename;
    let categoria = req.body.categoria;
    let sql = "update producto set nombre_producto='" + nombre + "', precio_producto='" + precio + "', img_producto='" + imagen + "', id_categoria='" + categoria + "' where id_producto=" + id;
    
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

/* FIN PRODUCTO */

/* STOCK */

router.get('/api/stock', (req, res) => {

    let sql = "select * from stock s inner join producto p on s.id_producto=p.id_producto";
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

router.put('/api/stock/:id', (req, res) => {

    let id = req.params.id;
    let stock = req.body.stock;
    let numero = req.body.numero;
    let tipo = req.body.tipo;
    let sql = "update stock set cantidad_stock=" + stock + " where id_producto=" + id;
    
    sqlDB(sql, function (err, rows) {

        let f = new Date();
        let fecha = f.getFullYear() + "-" + (f.getMonth()+1) + "-" + f.getDate() + " " + f.getHours() + ":" + f.getMinutes();

        let sql2 = "insert into historial (tipo_historial, cantidad_historial, fecha_historial, id_producto) values ('" + tipo + "', " + numero + ", '" + fecha + "', " + id + ")";

        sqlDB(sql2, function (err, rows) {
            res.json(rows);
        });

    });

});

/* FIN STOCK */

/* HISTORIAL */

router.get('/api/historial', (req, res) => {

    let sql = "select h.*, p.nombre_producto, (select cantidad_stock from stock s where s.id_producto=h.id_producto) as cantidad_stock from historial h left join producto p on h.id_producto=p.id_producto order by h.id_historial desc";
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

router.get('/api/historial/buscar/:busqueda', (req, res) => {

    let busqueda = req.params.busqueda;
    let sql = "select h.*, p.nombre_producto, (select cantidad_stock from stock s where s.id_producto=h.id_producto) as cantidad_stock from historial h left join producto p on h.id_producto=p.id_producto where p.nombre_producto like '%" + busqueda + "%' order by h.id_historial desc";
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

/* FIN HISTORIAL */

/* VENTA */
router.post('/api/venta', (req, res) => {

    let productos = req.body.productos;
    let total = req.body.total;
    let id = req.body.id;

    let f = new Date();
    let fecha = f.getFullYear() + "-" + (f.getMonth()+1) + "-" + f.getDate() + " " + f.getHours() + ":" + f.getMinutes();

    let sql = "insert into venta (total_venta, fecha_venta, id_usuario) values ('" + total + "', '" + fecha + "', '" + id + "')";

    sqlDB(sql, function (err, rows) {
        for(let i=0; i<productos.length; i++){
            let sql2 = "insert into detalle (cantidad_detalle, id_producto, id_venta) values ('" + productos[i].cantidad_carro + "', '" + productos[i].id_producto + "', '" + rows.insertId + "')";
            
            sqlDB(sql2, function (err, rows2) {
                let sql3 = "insert into historial (tipo_historial, cantidad_historial, fecha_historial, id_producto) values ('Venta', " + productos[i].cantidad_carro + ", '" + fecha + "', " + productos[i].id_producto + ")";

                sqlDB(sql3, function (err, rows3) {
                    let sql4 = "select * from stock where id_producto = " + productos[i].id_producto;
                    sqlDB(sql4, function (err, rows4) {
                        let sql5 = "update stock set cantidad_stock='" + (rows4[0].cantidad_stock - productos[i].cantidad_carro) + "' where id_producto=" + productos[i].id_producto;
                        sqlDB(sql5, function (err, rows5) {
                            if(i == (productos.length-1)){
                                res.json(rows);
                            }
                        });
                    });
                });

            });
        }
    });

});
/* FIN VENTA */

/* CATEGORIA */

router.get('/api/categoria', (req, res) => {

    let sql = "select * from categoria";
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

router.get('/api/categoria/buscar/:busqueda', (req, res) => {

    let busqueda = req.params.busqueda;
    let sql = "select * from categoria where nombre_categoria like '%" + busqueda + "%'";
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

router.post('/api/categoria', (req, res) => {

    let nombre = req.body.nombre;
    let sql = "insert into categoria (nombre_categoria) values ('" + nombre + "')";
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

router.put('/api/categoria/:id', (req, res) => {

    let id = req.params.id;
    let nombre = req.body.nombre;
    let sql = "update categoria set nombre_categoria='" + nombre + "' where id_categoria=" + id;
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

router.delete('/api/categoria/:id', (req, res) => {

    let id = req.params.id;
    let sql = "delete from categoria where id_categoria=" + id;
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

/* FIN CATEGORIA */

/* USUARIO */

router.get('/api/usuario', (req, res) => {

    let sql = "select * from usuario";
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

router.get('/api/usuario/buscar/:busqueda', (req, res) => {

    let busqueda = req.params.busqueda;
    let sql = "select * from usuario where nombre_usuario like '%" + busqueda + "%'";
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

router.post('/api/usuario', (req, res) => {

    const bcrypt = require('bcrypt');
    let nombre = req.body.nombre;
    let tipo = req.body.tipo;
    let alias = req.body.alias;
    let clave = bcrypt.hashSync(req.body.clave, 12);
    let sql = "insert into usuario (nombre_usuario, tipo_usuario, alias_usuario, clave_usuario) values ('" + nombre + "', '" + tipo + "', '" + alias + "', '" + clave + "')";
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

router.post('/api/login', (req, res) => {
    const bcrypt = require('bcrypt');
    let alias = req.body.alias;
    let clave = req.body.clave;
    let respuesta = {};
    
    let sql = "select * from usuario where alias_usuario='" + alias + "'";

    sqlDB(sql, function (err, rows) {

        if(rows.length==0){
            respuesta.estado = false;
            return res.json(respuesta);
        }
        else{
            if(bcrypt.compareSync(clave, rows[0].clave_usuario)){
                respuesta.estado = true;
                respuesta.datos = rows;
                return res.json(respuesta);
            }
            else{
                respuesta.estado = false;
                return res.json(respuesta);
            }
        }

    });
});

router.put('/api/usuario/:id', (req, res) => {

    let id = req.params.id;
    let nombre = req.body.nombre;
    let tipo = req.body.tipo;
    let alias = req.body.alias;
    let sql = "update usuario set nombre_usuario='" + nombre + "', tipo_usuario='" + tipo + "', alias_usuario='" + alias + "' where id_usuario=" + id;
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

router.delete('/api/usuario/:id', (req, res) => {

    let id = req.params.id;
    let sql = "delete from usuario where id_usuario=" + id;
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

/* FIN USUARIO */

/* MASCOTA */

router.get('/api/mascota/:id', (req, res) => {

    let id = req.params.id;
    let sql = "select m.*, r.nombre_raza, r.id_especie from mascota m inner join raza r on m.id_raza=r.id_raza where m.id_usuario=" + id;
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

router.get('/api/mascota/:id/buscar/:busqueda', (req, res) => {

    let id = req.params.id;
    let busqueda = req.params.busqueda;
    let sql = "select m.*, r.nombre_raza, r.id_especie from mascota m inner join raza r on m.id_raza=r.id_raza where m.id_usuario=" + id + " and m.nombre_mascota like '%" + busqueda + "%'";
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

router.post('/api/mascota', (req, res) => {

    let nombre = req.body.nombre;
    let peso = req.body.peso;
    let tamano = req.body.tamano;
    let color = req.body.color;
    let alergico = req.body.alergico;
    let enfermedades = req.body.enfermedades;
    let id_raza = req.body.id_raza;
    let id_usuario = req.body.id_usuario;
    let sql = "insert into mascota (nombre_mascota, peso_mascota, tamano_mascota, color_mascota, alergico_mascota, enfermedades_mascota, id_raza, id_usuario) values ('" + nombre + "', '" + peso + "', '" + tamano + "', '" + color + "', '" + alergico + "', '" + enfermedades + "', '" + id_raza + "', '" + id_usuario + "')";
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

router.put('/api/mascota/:id', (req, res) => {

    let id = req.params.id;
    let nombre = req.body.nombre;
    let peso = req.body.peso;
    let tamano = req.body.tamano;
    let color = req.body.color;
    let alergico = req.body.alergico;
    let enfermedades = req.body.enfermedades;
    let id_raza = req.body.id_raza;
    let sql = "update mascota set nombre_mascota='" + nombre + "', peso_mascota='" + peso + "', id_raza='" + id_raza + "', tamano_mascota='" + tamano + "', color_mascota='" + color + "', alergico_mascota='" + alergico + "', enfermedades_mascota='" + enfermedades + "' where id_mascota=" + id;
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

router.delete('/api/mascota/:id', (req, res) => {

    let id = req.params.id;
    let sql = "delete from mascota where id_mascota=" + id;
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

/* FIN MASCOTAS */

/* CITAS */

router.get('/api/cita', (req, res) => {

    let sql = "select c.*, u.nombre_usuario from cita c inner join mascota m on c.id_mascota=m.id_mascota inner join usuario u on m.id_usuario=u.id_usuario where c.status_cita='Pendiente'";
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

router.get('/api/cita/buscar/:busqueda', (req, res) => {

    let busqueda = req.params.busqueda;
    let sql = "select c.*, u.nombre_usuario from cita c inner join mascota m on c.id_mascota=m.id_mascota inner join usuario u on m.id_usuario=u.id_usuario where c.status_cita='Pendiente' and u.nombre_usuario like '%" + busqueda + "%'";
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

router.get('/api/cita/cliente/:id', (req, res) => {

    let id = req.params.id;
    let sql = "select c.*, m.nombre_mascota from cita c inner join mascota m on c.id_mascota=m.id_mascota where m.id_usuario=" + id;
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

router.get('/api/cita/cliente/:id/buscar/:busqueda', (req, res) => {

    let id = req.params.id;
    let busqueda = req.params.busqueda;
    
    let sql = "select c.*, m.nombre_mascota from cita c inner join mascota m on c.id_mascota=m.id_mascota where m.id_usuario=" + id + " and m.nombre_usuario like '%" + busqueda + "%'";
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

router.post('/api/cita/verificar', (req, res) => {

    let fecha = req.body.fecha;
    let sql = "select * from cita where fecha_cita like '%" + fecha + "%'";
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

router.post('/api/cita', (req, res) => {

    let fecha = req.body.fecha;
    let motivo = req.body.motivo;
    let status = "Pendiente";
    let id_mascota = req.body.id_mascota;
    let sql = "insert into cita (fecha_cita, motivo_cita, status_cita, id_mascota) values ('" + fecha + "', '" + motivo + "', '" + status + "', '" + id_mascota + "')";
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

router.put('/api/cita/:id', (req, res) => {

    let id = req.params.id;
    let fecha = req.body.fecha;
    let motivo = req.body.motivo;
    let id_mascota = req.body.id_mascota;
    let sql = "update cita set fecha_cita='" + fecha + "', motivo_cita='" + motivo + "', id_mascota='" + id_mascota + "' where id_cita=" + id;
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

router.post('/api/cita/atender', (req, res) => {

    let id = req.body.id;
    let motivo = req.body.motivo;
    let diagnostico = req.body.diagnostico;
    let sql = "update cita set motivo_cita='" + motivo + "', diagnostico_cita='" + diagnostico + "', status_cita='Atendida' where id_cita=" + id;
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

router.put('/api/cita/cancelar/:id', (req, res) => {

    let id = req.params.id;
    let sql = "update cita set status_cita='Cancelada' where id_cita=" + id;
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

router.put('/api/cita/perder/:id', (req, res) => {

    let id = req.params.id;
    let sql = "update cita set status_cita='Perdida' where id_cita=" + id;
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

/* FIN CITAS */

/* HISTORIAL CLINICO */

router.get('/api/historialclinico/:id', (req, res) => {

    let id = req.params.id;
    let sql = "select * from cita where status_cita='Atendida' and id_mascota=" + id + " order by fecha_cita desc";
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

/* FIN HISTORIAL CLINICO */

/* ESPECIE */

router.get('/api/especie', (req, res) => {

    let sql = "select * from especie";
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

router.get('/api/especie/buscar/:busqueda', (req, res) => {

    let busqueda = req.params.busqueda;
    let sql = "select * from especie where nombre_especie like '%" + busqueda + "%'";
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

router.post('/api/especie', (req, res) => {

    let nombre = req.body.nombre;
    let sql = "insert into especie (nombre_especie) values ('" + nombre + "')";
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

router.put('/api/especie/:id', (req, res) => {

    let id = req.params.id;
    let nombre = req.body.nombre;
    let sql = "update especie set nombre_especie='" + nombre + "' where id_especie=" + id;
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

router.delete('/api/especie/:id', (req, res) => {

    let id = req.params.id;
    let sql = "delete from especie where id_especie=" + id;
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

/* FIN ESPECIE */

/* RAZA */

router.get('/api/raza', (req, res) => {

    let sql = "select * from raza";
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

router.get('/api/raza/especie/:id', (req, res) => {

    let id = req.params.id;
    let sql = "select * from raza where id_especie=" + id;
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

router.get('/api/raza/buscar/:busqueda', (req, res) => {

    let busqueda = req.params.busqueda;
    let sql = "select * from raza where nombre_raza like '%" + busqueda + "%'";
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

router.post('/api/raza', (req, res) => {

    let nombre = req.body.nombre;
    let especie = req.body.especie;
    let sql = "insert into raza (nombre_raza, id_especie) values ('" + nombre + "', '" + especie + "')";
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

router.put('/api/raza/:id', (req, res) => {

    let id = req.params.id;
    let nombre = req.body.nombre;
    let especie = req.body.especie;
    let sql = "update raza set nombre_raza='" + nombre + "', id_especie='" + especie + "' where id_raza=" + id;
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

router.delete('/api/raza/:id', (req, res) => {

    let id = req.params.id;
    let sql = "delete from raza where id_raza=" + id;
    
    sqlDB(sql, function (err, rows) {

        res.json(rows);

    });

});

/* FIN RAZA */

module.exports = router;