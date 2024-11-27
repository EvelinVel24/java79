const API_URL = "http://localhost:8080/libros";

const formLibro = document.getElementById("formLibro");
const listaLibros = document.getElementById("listaLibros");

// Obtener y mostrar libros
async function obtenerLibros() {
    const respuesta = await fetch(API_URL);
    const libros = await respuesta.json();
    listaLibros.innerHTML = "";
    libros.forEach(libro => {
        const li = document.createElement("li");
        li.textContent = `${libro.titulo} - ${libro.autor} (${libro.anio}) - ${libro.disponible ? "Disponible" : "No disponible"}`;
        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.onclick = () => eliminarLibro(libro._id);
        const btnToggle = document.createElement("button");
        btnToggle.textContent = libro.disponible ? "Prestar" : "Devolver";
        btnToggle.onclick = () => actualizarDisponibilidad(libro._id, !libro.disponible);
        li.appendChild(btnEliminar);
        li.appendChild(btnToggle);
        listaLibros.appendChild(li);
    });
}

// Crear un libro
formLibro.onsubmit = async (e) => {
    e.preventDefault();
    const nuevoLibro = {
        titulo: document.getElementById("titulo").value,
        autor: document.getElementById("autor").value,
        anio: parseInt(document.getElementById("anio").value),
        disponible: true,
    };
    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoLibro),
    });
    formLibro.reset();
    obtenerLibros();
};

// Actualizar disponibilidad
async function actualizarDisponibilidad(id, disponible) {
    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disponible }),
    });
    obtenerLibros();
}

// Eliminar un libro
async function eliminarLibro(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    obtenerLibros();
}

// Inicializar
obtenerLibros();
