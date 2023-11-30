//common js
import express from 'express';
import fs from "fs"; //me permite trabajar con file system, parte de node

//creando objeto de la aplicacion para listener
const app = express(); 
app.use(express.json());

const readData = () => {
    
    const data = fs.readFileSync("./peliculas.json"); //me ahorra colocar callback "(data)=>{}"
    return JSON.parse(data);
};

const writeData = (data) => {
    try {
        fs.writeFileSync("./peliculas.json", JSON.stringify(data)); //me ahorra colocar callback "(data)=>{}"
        console.log('Data written successfully');
    }catch (error) {
        console.log(error);
    }
};


app.get("/", (req, res) => {
    res.send("Bienvenido a la Cartelera!");
});

//end point
//GET

app.get("/peliculas", (req, res) => {
    const data = readData();
    res.json(data.peliculas);
});
//GET + id
app.get("/peliculas/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const pelicula = data.peliculas.find((pelicula) => pelicula.id === id);
    res.json(pelicula);
});
// POST

app.post("/peliculas", (req, res) => {
    const data = readData();
    const body = req.body;
    const newPelicula = {
        id: data.peliculas.length + 1,
        ...body, //SPREAD OPERATOR "..."
    }
    data.peliculas.push(newPelicula);
    writeData(data);
    res.json(newPelicula);
});

//put
app.put("/peliculas/:id", (req, res) =>{
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const indexPelicula = data.peliculas.findIndex((pelicula) => pelicula.id === id);
    data.peliculas[indexPelicula] = {
        ...data.peliculas[indexPelicula],
        ...body,
    };
    writeData(data);
    res.json({message: "Pelicula actualizada correctamente"});
});

//DELETE
app.delete("/peliculas/:id", (req, res) =>{
    const data = readData();
    const id = parseInt(req.params.id);
    const indexPelicula = data.peliculas.findIndex((pelicula) => pelicula.id === id);
    data.peliculas.splice(indexPelicula, 1);
    writeData(data);
    res.json({message: "Pelicula borrada correctamente"});
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});