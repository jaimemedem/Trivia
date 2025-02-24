let api_token;

document.getElementById("jugarBtn").addEventListener("click", function(event) {
    event.preventDefault(); // Evita que el enlace cambie de página inmediatamente
    iniciarJuego();
    setTimeout(() => {
        window.location.href = "game.html"; // Redirigir después de ejecutar iniciarJuego()
    }, 1000); // Espera 1 segundo antes de redirigir (ajusta el tiempo si es necesario)
});


function iniciarJuego() {
    fetch("https://opentdb.com/api_token.php?command=request")
        .then(response => response.json())
        .then(data => {
            api_token = data.token;
            console.log("token obteniado=",api_token);
            preguntar();
        })
        .catch(error => console.error("Error obteniendo token:", error));
}

function preguntar() {
    fetch(`https://opentdb.com/api.php?amount=1&category=9&difficulty=medium&type=multiple&token=${api_token}`)
        .then(response => response.json())
        .then(data => {
            let pregunta = data.results[0].question;
            let respuesta_correcta = data.results[0].correct_answer;
            let respuestas = [...data.results[0].incorrect_answers, respuesta_correcta];

            respuestas.sort(() => Math.random() - 0.5);

            document.getElementById("pregunta").innerHTML = pregunta;

            let opcionesHTML = "";
            respuestas.forEach(respuesta => {
                opcionesHTML += `<button class="opcion" onclick="verificarRespuesta('${respuesta}', '${respuesta_correcta}')">${respuesta}</button>`;
            });

            document.getElementById("opciones").innerHTML = opcionesHTML;
        })
        .catch(error => console.error("Error obteniendo pregunta:", error));
}

function verificarRespuesta(respuestaSeleccionada, respuestaCorrecta) {
    if (respuestaSeleccionada === respuestaCorrecta) {
        alert("✅ ¡Correcto!");
    } else {
        alert("❌ Incorrecto. La respuesta correcta era: " + respuestaCorrecta);
    }

    preguntar();
}

iniciarJuego();



