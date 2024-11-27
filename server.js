const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Conexión a la base de datos MongoDB
mongoose.connect("mongodb://localhost/biblioteca", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error al conectar a MongoDB:", err));

// Esquema y modelo de libro
const libroSchema = new mongoose.Schema({
    titulo: String,
    autor: String,
    anio: Number,
    disponible: Boolean,
});

const Libro = mongoose.model("Libro", libroSchema);

// Rutas CRUD
// Obtener todos los libros
app.get("/libros", async (req, res) => {
    const libros = await Libro.find();
    res.json(libros);
});

// Crear un nuevo libro
app.post("/libros", async (req, res) => {
    const nuevoLibro = new Libro(req.body);
    await nuevoLibro.save();
    res.json(nuevoLibro);
});

// Actualizar disponibilidad de un libro
app.put("/libros/:id", async (req, res) => {
    const libroActualizado = await Libro.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(libroActualizado);
});

// Eliminar un libro
app.delete("/libros/:id", async (req, res) => {
    await Libro.findByIdAndDelete(req.params.id);
    res.json({ message: "Libro eliminado" });
});

// Iniciar el servidor
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
