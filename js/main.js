function iniciarJuego() {
    let estado=true;
    let api_token;
    fetch("https://opentdb.com/api_token.php?command=request")
        .then(response => response.json())
        .then(data =>
            api_token=data.token
        )
    while(estado==true){
        estado=preguntar(estado,api_token);
    }
    };
function preguntar(estado, token)
{

    let respuesta;
    fetch(`https://opentdb.com/api.php?amount=1&category=9&difficulty=medium&type=multiple&token=${token}`)
    .then(response=>response.json())
    .then(data=>{
        let pregunta=data.results[0].question;
        let respuesta_correcta=data.results[0].correct_answer;
        let respuestas=[...data.results[0].incorrect_answers,data.results[0].correct_answers];
        respuestas.sort(()=>Math.random()-0.5);

        document.getElementById("pregunta")=pregunta;

        let opcionesHTML="";
        respuestas.forEach(respuesta => {
            opcionesHTML+=`<button class='opcion'>${respuesta}</button>`;
        });
        document.getElementById("opciones").innerHTML=opcionesHTML;
    }
    )

}


