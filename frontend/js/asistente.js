const toggleBtn = document.getElementById("chatbot-toggle");
const chatbot = document.getElementById("chatbot");
const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatbotBody = document.getElementById("chatbot-body");

toggleBtn.addEventListener("click", () => {
    chatbot.classList.toggle('open'); 
});

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
    const message = userInput.value.trim();
    if (message === "") return;

    appendMessage("user", message);
    userInput.value = "";

    const botThinkingDiv = appendMessage("bot", "...")
    botThinkingDiv.classList.add('thinking');


    const response = await getBotResponse(message.toLowerCase());
    
    botThinkingDiv.textContent = response;
    botThinkingDiv.classList.remove('thinking');

    chatbotBody.scrollTop = chatbotBody.scrollHeight;
    
    speak(response);
}

function appendMessage(sender, text) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add(sender === "bot" ? "bot-message" : "user-message");
    messageDiv.innerHTML = text; 
    chatbotBody.appendChild(messageDiv);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
    return messageDiv; 
}

async function getBotResponse(input) {
    input = input.toLowerCase(); 

    if (input.includes("hola") || input.includes("buenas"))
        return "¡Hola! 👋 Soy Zyco. ¿En qué puedo ayudarte hoy?";
    if (input.includes("cómo estás") || input.includes("como estas"))
        return "¡Estoy lista para ayudarte! 💚 Espero que tú también tengas un buen día.";
    if (input.includes("gracias"))
        return "¡De nada! 🌿 Cuidar el planeta es trabajo en equipo.";
    if (input.includes("adiós") || input.includes("chao") || input.includes("hasta luego"))
        return "¡Hasta pronto! No olvides revisar las alertas ambientales de tu zona.";
    if (input.includes("quién eres") || input.includes("quien eres"))
        return "Soy Zyn 🤖, la asistente virtual de Zynecova. Estoy aquí para informarte sobre el clima, alertas y reportes ambientales.";

    if (input.includes("qué es zynecova") || input.includes("que es zynecova"))
        return "Zynecova es una plataforma de monitoreo ambiental que detecta anomalías, cambios climáticos y eventos naturales importantes. 🌤️";
    if (input.includes("objetivo"))
        return "El objetivo de Zynecova es proteger el ambiente y alertar a las comunidades ante riesgos naturales o climáticos. 🌎";
    if (input.includes("mision"))
        return "Nuestra misión es promover el monitoreo ambiental inteligente y la participación ciudadana. 🌿";
    if (input.includes("vision"))
        return "Nuestra visión es convertirnos en una red nacional de monitoreo climático confiable y sostenible. 🌍";
    if (input.includes("quién te creó") || input.includes("quien te creo"))
        return "Fui creada por el equipo de desarrollo de Zynecova 💻 como parte de un proyecto de innovación ambiental.";

    if (input.includes("cómo funciona") || input.includes("como funciona"))
        return "Zynecova recopila datos de sensores, reportes ciudadanos y fuentes meteorológicas para detectar anomalías. ☁️";
    if (input.includes("cómo usar") || input.includes("como usar"))
        return "Navega por las secciones para ver alertas, enviar reportes y conocer el estado ambiental de tu zona. 🌎";
    if (input.includes("alertas activas"))
        return "Puedes ver las alertas activas en el panel principal. Cada color indica el nivel de riesgo: verde (normal), amarillo (precaución) y rojo (peligro). 🚨";
    if (input.includes("panel ambiental"))
        return "El panel ambiental muestra el mapa con los eventos reportados y el nivel de riesgo actual. 🗺️";

    if (input.includes("reportar") || input.includes("enviar reporte"))
        return "Para reportar una anomalía ambiental, ve a la sección ‘Reportar incidente’ y completa el formulario. 📋";
    if (input.includes("qué puedo reportar") || input.includes("tipos de reportes"))
        return "Puedes reportar incendios, derrumbes, inundaciones, contaminación o cualquier evento ambiental anormal. 🌋";
    if (input.includes("últimos reportes") || input.includes("reportes recientes"))
        return "Consulta los reportes recientes en la sección ‘Panel ambiental’. 🕒";
    if (input.includes("problema ambiental"))
        return "Si observas un problema ambiental, repórtalo con una descripción breve y ubicación. Ayudas a prevenir riesgos. 🌱";
    if (input.includes("anomalías"))
        return "Las anomalías son eventos fuera de lo normal, como cambios bruscos de temperatura o lluvias extremas. 🌦️";

    if (input.includes("clima") || input.includes("pronóstico"))
        return "Puedes consultar el clima actual en tu zona desde el panel de condiciones climáticas. 🌤️";
    if (input.includes("temperatura"))
        return "Zynecova muestra la temperatura, humedad, presión y estado del cielo en tiempo real. 🌡️";
    if (input.includes("riesgo alto"))
        return "Una alerta roja indica un riesgo ambiental alto. Mantente en un lugar seguro y sigue las recomendaciones. 🚨";
    if (input.includes("precaución"))
        return "Una alerta amarilla significa que existe posibilidad de eventos naturales leves. Mantente informado. ⚠️";
    if (input.includes("normal"))
        return "Nivel verde 🌿: no se registran riesgos ambientales en tu zona actualmente.";

    if (input.includes("registrarse") || input.includes("crear cuenta"))
        return "Haz clic en ‘Registrarse’ en el menú superior y completa tus datos para acceder a todas las funciones. 📝";
    if (input.includes("iniciar sesión"))
        return "Ve a ‘Iniciar sesión’ para entrar a tu cuenta y ver tus reportes. 🔐";
    if (input.includes("perfil"))
        return "En tu perfil puedes ver tus datos, editar información y activar notificaciones. 👤";
    if (input.includes("contraseña") || input.includes("recuperar"))
        return "Si olvidaste tu contraseña, puedes recuperarla desde la opción ‘¿Olvidaste tu contraseña?’ en el login. 🔑";

    if (input.includes("contacto") || input.includes("ayuda"))
        return "Puedes contactarnos en soporte@zynecova.com o desde la sección ‘Contacto’. 📩";
    if (input.includes("ubicación") || input.includes("dónde están"))
        return "Zynecova monitorea diferentes regiones del país con el apoyo de entidades ambientales. 🗺️";
    if (input.includes("soporte técnico"))
        return "Nuestro equipo técnico está disponible para ayudarte de lunes a viernes de 8 a.m. a 6 p.m. 💬";

    if (input.includes("consejos") || input.includes("recomendaciones"))
        return "💡 Consejos ambientales:\n1️⃣ Usa menos plástico.\n2️⃣ Ahorra agua y energía.\n3️⃣ Recicla.\n4️⃣ Cuida los árboles.\n5️⃣ Reporta anomalías.";
    if (input.includes("reciclaje"))
        return "Reciclar ayuda a reducir la contaminación. Separa residuos en: orgánicos, reciclables y no reciclables. ♻️";
    if (input.includes("cambio climático"))
        return "El cambio climático es el aumento de la temperatura global causado por gases contaminantes. 🌡️";
    if (input.includes("educación ambiental"))
        return "La educación ambiental nos enseña a cuidar los recursos naturales y vivir de forma sostenible. 📘";
    if (input.includes("sostenibilidad"))
        return "La sostenibilidad busca satisfacer las necesidades actuales sin dañar el futuro del planeta. 🌍";

    if (input.includes("preocupado") || input.includes("miedo"))
        return "Es normal sentirse preocupado. 💚 La mejor forma de ayudar es mantenerse informado y compartir reportes reales.";
    if (input.includes("feliz") || input.includes("contento"))
        return "¡Qué bueno escuchar eso! 😊 Cuidar el ambiente también nos hace sentir bien.";

    if (input.includes("inicio") || input.includes("página principal")) {
        window.location.href = "index.html";
        return "Te llevo al inicio 🏠";
    }
    if (input.includes("panel") || input.includes("mapa")) {
        window.location.href = "panel.html";
        return "Abriendo el panel de monitoreo ambiental 🗺️";
    }

    try {
        const response = await google.search({ queries: [input] });
        return response.result || "No tengo una respuesta exacta para eso 🤔. Pero puedo ayudarte con temas como alertas, clima, reportes o consejos ambientales.";
    } catch (error) {
        console.error("Error en la búsqueda dinámica:", error);
        return "Lo siento, tengo problemas para conectarme y buscar información en este momento. Inténtalo de nuevo más tarde.";
    }
}

function speak(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "es-ES";
    speech.pitch = 1;
    speech.rate = 1;
    window.speechSynthesis.speak(speech);
}