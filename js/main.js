function iniciarJuego() {
    let nombre = document.getElementById("nombre").value.trim();

    if (nombre === "") {
        alert("Por favor, introduce tu nombre antes de jugar.");
        return;
    }

    // Guardamos el nombre en localStorage para usarlo en el juego
    localStorage.setItem("jugador", nombre);
    localStorage.setItem("puntuacion", 0); // Inicializamos la puntuación

    alert(`¡Bienvenido, ${nombre}! El juego comenzará ahora.`);
    
    // Redirigir a la pantalla del juego
    window.location.href = "juego.html";
}
