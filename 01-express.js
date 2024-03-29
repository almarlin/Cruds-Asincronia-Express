const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');



// Para subir imagenes
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directorio donde se guardarán los archivos
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Nombre único del archivo
  }
});
const upload = multer({ storage: storage });

// Configuraciones de Express
app.use(express.json()); // Parsear JSON
app.use(express.urlencoded({ extended: false })); // Parsear datos de formulario urlencoded

// Configuraciones de vistas
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views/');

// Rutas
app.use('/', require('./router/rutas'));
app.use('/miniature', require('./router/miniature'));

// Servir archivos estáticos
app.use('/static', express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));

// Manejo de errores  404
app.use((req, res) => {
    res.status(404).sendFile(`${__dirname}/assets/404.html`);
});

// Configuración de la base de datos
require('dotenv').config();

const uri = `mongodb+srv://admin:${process.env.PASSWORD}@cluster0.ylzwpme.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Base de datos conectada'))
    .catch(e => console.log(e));

// Iniciar el servidor
const port = process.env.PORT ||  3000;
app.listen(port, () => {
    console.log(`Iniciando Express en el puerto ${port}`);
    console.log(`http://localhost:${port}`);
});

// Exportar la aplicación para su uso en otros archivos
module.exports = app;
