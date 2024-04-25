const express = require('express');
const cors = require ('cors');
const fs = require ('fs');
const descuentos = require('./descuentos.json');
const translate = require('node-google-translate-skidz');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/descuentos', (req, res) => {
    try {
        res.json(descuentos);
    } catch (error) {
        console.error('Error al obtener los descuentos:', error);
        res.status(500).json({ error: 'Error al obtener los descuentos' });
    }
});


app.get('/traducir', async (req, res) => {
    try {
        const { title, description } = req.query;
        
        const tituloTraducido = await translate({ text: title, source: 'en', target: 'es' });
        const descripcionTraducida = await translate({ text: description, source: 'en', target: 'es' });

        res.json({ title: tituloTraducido.translation, description: descripcionTraducida.translation });
    } catch (error) {
        console.error('Error al traducir:', error);
        res.status(500).json({ error: 'Error al traducir los textos' });
    }
});


app.post('/compra', (req, res) => {
    const compra = req.body;
    guardarCompraEnJSON(compra);
    res.json({ mensaje: 'Compra realizada con éxito.' });
});

function guardarCompraEnJSON(compra) {
    let compras = [];
    try {
        const data = fs.readFileSync('compras.json', 'utf8');
        compras = JSON.parse(data);
    } catch (err) {
        console.error('Error al leer el archivo JSON:', err);
    }
    compras.push(compra);
    fs.writeFileSync('compras.json', JSON.stringify(compras, null, 4));
}


app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});