import express from 'express';
import fs from 'fs';
import crypto from 'crypto';

const app = express();
app.use(express.json());

const readData = () => {
    const data = fs.readFileSync('./peliculas.json');
    return JSON.parse(data);
};

const writeData = (data) => {
    try {
        fs.writeFileSync('./peliculas.json', JSON.stringify(data, null, 2));
        console.log('Data written successfully');
    } catch (error) {
        console.log(error);
    }
};

const encryptData = (data) => {
    const algorithm = 'aes-256-cbc';
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return {
        encryptedData: encrypted,
        iv: iv.toString('hex'),
    };
};

const decryptData = (encryptedData, iv) => {
    const algorithm = 'aes-256-cbc';
    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));

    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
};

app.get('/', (req, res) => {
    res.send('Bienvenido a la Cartelera!');
});

app.get('/peliculas', (req, res) => {
    const data = readData();
    res.json(data.peliculas);
});

app.get('/peliculas/:id', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const pelicula = data.peliculas.find((pelicula) => pelicula.id === id);

    // Decryption of the title field before sending the response
    if (pelicula && pelicula.titulo && pelicula.iv) {
        pelicula.titulo = decryptData(pelicula.titulo, pelicula.iv);
    }

    res.json(pelicula);
});

app.post('/peliculas', (req, res) => {
    const data = readData();
    const body = req.body;

    const encryptedTitle = encryptData(body.titulo);
    body.titulo = encryptedTitle.encryptedData;
    body.iv = encryptedTitle.iv;

    const newPelicula = {
        id: data.peliculas.length + 1,
        ...body,
    };
    data.peliculas.push(newPelicula);
    writeData(data);
    res.json(newPelicula);
});

app.put('/peliculas/:id', (req, res) => {
    // ... (Implementa tu lógica de actualización)
});

app.delete('/peliculas/:id', (req, res) => {
    // ... (Implementa tu lógica de eliminación)
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
