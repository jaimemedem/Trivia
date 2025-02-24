let puntuacion = 0;
let apiToken = null;
let questions = [];
let currentQuestionIndex = 0;

document.addEventListener("DOMContentLoaded", async () => {
  refrescarScores();
  await obtenerTokenSiNecesario();
  await obtenerPreguntas();
});

async function obtenerTokenSiNecesario() {
  apiToken = localStorage.getItem("opentdbToken"); 
  if (!apiToken) {
    try {
      const response = await fetch("https://opentdb.com/api_token.php?command=request");
      if (!response.ok) {
        throw new Error("No se pudo solicitar el token");
      }
      const data = await response.json();
      apiToken = data.token;
      localStorage.setItem("opentdbToken", apiToken);
    } catch (error) {
      console.error("Error obteniendo token:", error);
    }
  }
}

async function obtenerPreguntas() {
  try {
    const response = await fetch(`https://opentdb.com/api.php?amount=5&category=9&difficulty=medium&type=multiple&token=${apiToken}`);
    if (response.status === 429) {
      throw new Error("Demasiadas solicitudes. Intenta de nuevo más tarde.");
    }
    if (!response.ok) {
      throw new Error("Error en la respuesta de la API");
    }
    const data = await response.json();

    if (data.response_code === 3) {
      console.warn("Token inválido. Se solicitará uno nuevo en la próxima carga.");
      localStorage.removeItem("opentdbToken");
    }

    questions = data.results;
    currentQuestionIndex = 0;
    mostrarPregunta();
  } catch (error) {
    console.error(error);
    document.getElementById("feedback").textContent = error.message;
  }
}

function mostrarPregunta() {
    // Limpiar mensaje de feedback
    document.getElementById("feedback").textContent = "";
    
    if (currentQuestionIndex >= questions.length) {
      document.getElementById("feedback").textContent = "¡No hay más preguntas disponibles!";
      currentQuestionIndex = 0;
      // Vuelve a cargar nuevas preguntas
      obtenerPreguntas();
      return;
    }
  
    const preguntaObj = questions[currentQuestionIndex];
    const pregunta = preguntaObj.question;
    const respuestaCorrecta = preguntaObj.correct_answer;
    let respuestas = [...preguntaObj.incorrect_answers, respuestaCorrecta];
  
    respuestas.sort(() => Math.random() - 0.5);
  
    document.getElementById("pregunta").innerHTML = pregunta;
  
    let opcionesHTML = "";
    respuestas.forEach(resp => {
      opcionesHTML += `
        <button 
          class="opcion" 
          onclick="verificarRespuesta('${resp}', '${respuestaCorrecta}')"
        >
          ${resp}
        </button>
      `;
    });
  
    document.getElementById("opciones").innerHTML = opcionesHTML;
  }
  
function refrescarScores() {
  document.getElementById("currentScoreDisplay").textContent = puntuacion;
  document.getElementById("highScoreDisplay").textContent = localStorage.getItem("highScore") || 0;
}

function exitGame() {
    window.location.href = "index.html";
  }
  

function verificarRespuesta(respuestaSeleccionada, respuestaCorrecta) {
  const feedbackElement = document.getElementById("feedback");
  
  if (respuestaSeleccionada === respuestaCorrecta) {
    feedbackElement.textContent = "✅ ¡Correcto!";
    feedbackElement.style.color = "green";
    puntuacion++;
    let highScore = localStorage.getItem("highScore");
    if (!highScore || puntuacion > parseInt(highScore)) {
      localStorage.setItem("highScore", puntuacion);
    }
  } else {
    feedbackElement.textContent = "❌ Incorrecto. La respuesta correcta era: " + respuestaCorrecta;
    feedbackElement.style.color = "red";
    puntuacion=0;
  }
  
  refrescarScores();
  currentQuestionIndex++;
  
  // Espera un momento para mostrar el feedback antes de cargar la siguiente pregunta
  setTimeout(() => {
    mostrarPregunta();
  }, 1500);
}
