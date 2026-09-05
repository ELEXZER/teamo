const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const inicio = document.getElementById("inicio");
const mensaje = document.getElementById("mensaje");
const reiniciar = document.getElementById("reiniciar");

let W;
let H;

let progreso = 0;
let velocidad = 0;

let iniciado = false;
let terminado = false;

let ultimaY = null;


/* =========================
   CONFIGURACIÓN
========================= */

const cantidadFlores = 260;
const cantidadParticulas = 90;

const flores = [];
const particulas = [];


/* =========================
   AJUSTAR CANVAS
========================= */

function resize() {

    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;

}

window.addEventListener("resize", resize);

resize();


/* =========================
   UTILIDADES
========================= */

function aleatorio(min, max) {

    return Math.random() * (max - min) + min;

}

function limitar(valor, min, max) {

    return Math.max(min, Math.min(max, valor));

}


/* =========================
   CREAR FLORES
========================= */

function crearFlores() {

    flores.length = 0;

    for (let i = 0; i < cantidadFlores; i++) {

        flores.push({

            x: aleatorio(-1.2, 1.2),

            profundidad: Math.random(),

            tamaño: aleatorio(0.7, 1.3),

            inclinacion: aleatorio(-0.25, 0.25),

            fase: aleatorio(0, Math.PI * 2)

        });

    }

}

crearFlores();


/* =========================
   CREAR PARTÍCULAS
========================= */

function crearParticulas() {

    particulas.length = 0;

    for (let i = 0; i < cantidadParticulas; i++) {

        particulas.push({

            x: Math.random(),

            y: Math.random(),

            tamaño: aleatorio(1, 3),

            velocidad: aleatorio(0.0005, 0.002),

            fase: aleatorio(0, Math.PI * 2)

        });

    }

}

crearParticulas();


/* =========================
   CIELO
========================= */

function dibujarCielo() {

    const progresoCielo = limitar(progreso / 100, 0, 1);

    const cielo = ctx.createLinearGradient(
        0,
        0,
        0,
        H
    );

    cielo.addColorStop(
        0,
        mezclarColor(
            [45, 45, 100],
            [15, 10, 45],
            progresoCielo
        )
    );

    cielo.addColorStop(
        0.55,
        mezclarColor(
            [230, 140, 100],
            [80, 45, 85],
            progresoCielo
        )
    );

    cielo.addColorStop(
        1,
        "#39252c"
    );

    ctx.fillStyle = cielo;

    ctx.fillRect(
        0,
        0,
        W,
        H
    );

}


/* =========================
   MEZCLAR COLORES
========================= */

function mezclarColor(a, b, cantidad) {

    const r = Math.round(
        a[0] + (b[0] - a[0]) * cantidad
    );

    const g = Math.round(
        a[1] + (b[1] - a[1]) * cantidad
    );

    const bColor = Math.round(
        a[2] + (b[2] - a[2]) * cantidad
    );

    return `rgb(${r},${g},${bColor})`;

}


/* =========================
   SOL
========================= */

function dibujarSol() {

    /*
       El sol empieza lejos y pequeño.
       Conforme avanzamos, parece que
       nos acercamos a él.
    */

    const avance = limitar(progreso / 100, 0, 1);

    const x = W * 0.5;

    /*
       Al principio está más arriba.
       Al final queda justo frente
       a nosotros.
    */

    const yInicial = H * 0.26;
    const yFinal = H * 0.42;

    const y =
        yInicial +
        (yFinal - yInicial) * avance;

    /*
       El sol aumenta un poco de tamaño
       mientras nos acercamos.
    */

    const radioInicial =
        Math.min(W, H) * 0.035;

    const radioFinal =
        Math.min(W, H) * 0.11;

    const radio =
        radioInicial +
        (radioFinal - radioInicial) * avance;

    /*
       Brillo del sol.
    */

    const brillo = ctx.createRadialGradient(
        x,
        y,
        radio * 0.1,
        x,
        y,
        radio * 4
    );

    brillo.addColorStop(
        0,
        "rgba(255,235,180,0.95)"
    );

    brillo.addColorStop(
        0.3,
        "rgba(255,210,140,0.45)"
    );

    brillo.addColorStop(
        1,
        "rgba(255,180,100,0)"
    );

    ctx.fillStyle = brillo;

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        radio * 4,
        0,
        Math.PI * 2
    );

    ctx.fill();

    /*
       Sol.
    */

    ctx.fillStyle = "#ffd58a";

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        radio,
        0,
        Math.PI * 2
    );

    ctx.fill();

}


/* =========================
   CAMPO
========================= */

function dibujarCampo() {

    const horizonte = H * 0.45;

    const campo = ctx.createLinearGradient(
        0,
        horizonte,
        0,
        H
    );

    campo.addColorStop(
        0,
        "#3c6138"
    );

    campo.addColorStop(
        1,
        "#172b20"
    );

    ctx.fillStyle = campo;

    ctx.beginPath();

    ctx.moveTo(0, horizonte);

    ctx.lineTo(W, horizonte);

    ctx.lineTo(W, H);

    ctx.lineTo(0, H);

    ctx.closePath();

    ctx.fill();

}


/* =========================
   DIBUJAR CAMINO
========================= */

function dibujarCamino() {

    const horizonte = H * 0.45;

    /*
       El camino siempre termina
       exactamente en el horizonte,
       donde está el sol.
    */

    const centro = W * 0.5;

    /*
       Anchura que tiene el camino
       cuando está muy lejos.
    */

    const anchoLejano =
        W * 0.012;

    /*
       Anchura que tiene al llegar
       a la parte inferior de la pantalla.
    */

    const anchoCercano =
        W * 0.42;

    ctx.beginPath();

    /*
       Inicio del camino:
       muy lejos.
    */

    ctx.moveTo(
        centro - anchoLejano,
        horizonte
    );

    ctx.lineTo(
        centro + anchoLejano,
        horizonte
    );

    /*
       Parte cercana:
       mucho más ancha.
    */

    ctx.lineTo(
        centro + anchoCercano,
        H
    );

    ctx.lineTo(
        centro - anchoCercano,
        H
    );

    ctx.closePath();

    const camino =
        ctx.createLinearGradient(
            0,
            horizonte,
            0,
            H
        );

    camino.addColorStop(
        0,
        "rgba(125,95,65,0.25)"
    );

    camino.addColorStop(
        0.5,
        "rgba(110,80,55,0.40)"
    );

    camino.addColorStop(
        1,
        "rgba(75,52,42,0.75)"
    );

    ctx.fillStyle = camino;

    ctx.fill();

}


/* =========================
   DIBUJAR LIRIO
========================= */

function dibujarLirio(x, y, escala, inclinacion) {

    ctx.save();

    ctx.translate(x, y);

    ctx.rotate(inclinacion);

    /*
       TALLO
    */

    ctx.strokeStyle = "#35683c";

    ctx.lineWidth =
        Math.max(1, 3 * escala);

    ctx.beginPath();

    ctx.moveTo(0, 0);

    ctx.quadraticCurveTo(
        -3 * escala,
        -35 * escala,
        0,
        -70 * escala
    );

    ctx.stroke();


    /*
       HOJAS
    */

    ctx.fillStyle = "#477f47";

    ctx.beginPath();

    ctx.ellipse(
        -7 * escala,
        -25 * escala,
        5 * escala,
        22 * escala,
        -0.5,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.beginPath();

    ctx.ellipse(
        7 * escala,
        -38 * escala,
        5 * escala,
        22 * escala,
        0.5,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
       FLOR
    */

    const fy = -75 * escala;

    ctx.translate(
        0,
        fy
    );

    /*
       pétalos
    */

    const colores = [
        "#d9b7d7",
        "#c996c5",
        "#e4c5df",
        "#b77eb0",
        "#d8a8cf",
        "#c58abd"
    ];

    for (let i = 0; i < 6; i++) {

        const angulo =
            (Math.PI * 2 / 6) * i;

        ctx.save();

        ctx.rotate(angulo);

        ctx.fillStyle =
            colores[i];

        ctx.beginPath();

        ctx.moveTo(0, 0);

        ctx.bezierCurveTo(
            -14 * escala,
            -10 * escala,
            -18 * escala,
            -32 * escala,
            0,
            -37 * escala
        );

        ctx.bezierCurveTo(
            18 * escala,
            -32 * escala,
            14 * escala,
            -10 * escala,
            0,
            0
        );

        ctx.fill();

        ctx.restore();

    }


    /*
       CENTRO
    */

    ctx.fillStyle = "#e8b84c";

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        6 * escala,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.restore();

}


/* =========================
   FLORES CON PROFUNDIDAD
========================= */

function dibujarFlores() {

    const horizonte = H * 0.45;

    flores.forEach(flor => {

        /*
           El progreso modifica la posición
           de las flores para crear sensación
           de movimiento hacia adelante.
        */

        let z =
            (
                flor.profundidad +
                progreso * 0.018
            ) % 1;

        const perspectiva =
            1 - z;

        /*
           Flores pequeñas cuando están lejos.
           Flores grandes cuando están cerca.
        */

        const escala =
            0.12 +
            perspectiva * 2.0;

        /*
           Posición horizontal.
        */

        const x =
            W / 2 +
            flor.x * W * perspectiva;

        /*
           Posición vertical.

           Esto hace que las flores lejanas
           estén cerca del horizonte y las
           cercanas aparezcan abajo.
        */

        const y =
            horizonte +
            Math.pow(
                perspectiva,
                1.55
            ) * H * 0.65;

        /*
           Movimiento del viento.
        */

        const inclinacion =
            flor.inclinacion +
            Math.sin(
                Date.now() * 0.0015 +
                flor.fase
            ) * 0.05;

        dibujarLirio(
            x,
            y,
            escala * flor.tamaño,
            inclinacion
        );

    });

}


/* =========================
   PARTÍCULAS
========================= */

function dibujarParticulas() {

    particulas.forEach(p => {

        p.y -= p.velocidad;

        if (p.y < 0) {

            p.y = 1;

        }

        const x =
            p.x * W +
            Math.sin(
                Date.now() * 0.001 +
                p.fase
            ) * 20;

        const y =
            p.y * H;

        ctx.fillStyle =
            "rgba(255,235,170,0.7)";

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            p.tamaño,
            0,
            Math.PI * 2
        );

        ctx.fill();

    });

}


/* =========================
   ANIMACIÓN
========================= */

function animar() {

    requestAnimationFrame(animar);

    dibujarCielo();

    dibujarSol();

    dibujarCampo();

    dibujarCamino();

    dibujarFlores();

    dibujarParticulas();

}

animar();

/* =========================
   CONTROL TÁCTIL
========================= */


window.addEventListener("touchstart", function(e) {

    tocando = true;

    ultimaY = e.touches[0].clientY;

    if (!iniciado) {

        iniciado = true;

        inicio.classList.add("ocultar");

    }

}, { passive: true });

window.addEventListener(
    "touchmove",
    function(e) {

        if (
            !tocando ||
            terminado
        ) return;

        const nuevaY =
            e.touches[0].clientY;

        const diferencia =
            ultimaY - nuevaY;

        if (diferencia > 0) {

            progreso +=
                diferencia * 0.08;

        }

        ultimaY = nuevaY;

        progreso = limitar(
            progreso,
            0,
            100
        );

        comprobarFinal();

    },
    { passive: true }
);


window.addEventListener("touchend", function() {

    tocando = false;

    ultimaY = 0;

});


/* =========================
   MOUSE / PC
========================= */

let mouseY = null;

window.addEventListener("mousedown", function(e) {

    mouseY = e.clientY;

    if (!iniciado) {

        iniciado = true;

        inicio.classList.add("ocultar");

    }

});


window.addEventListener("mousemove", function(e) {

    if (
        mouseY === null ||
        terminado
    ) return;

    const diferencia =
        mouseY - e.clientY;

    if (diferencia > 0) {

        progreso += diferencia * 0.05;

    }

    mouseY = e.clientY;

    progreso = limitar(
        progreso,
        0,
        100
    );

    comprobarFinal();

});


window.addEventListener("mouseup", function() {

    mouseY = null;

});

/* =========================
   RUEDA DEL RATÓN
========================= */

window.addEventListener(
    "wheel",
    e => {

        if (terminado) return;

        if (!iniciado) {

            iniciado = true;

            inicio.classList.add(
                "ocultar"
            );

        }

        /*
           Avance suave.
        */

        progreso += e.deltaY * 0.045;

        progreso = limitar(
            progreso,
            0,
            100
        );

        comprobarFinal();

    },
    { passive: true }
);

/* =========================
   FINAL
========================= */

function comprobarFinal() {

    /*
       Todavía no mostramos el mensaje.
       Primero tenemos que llegar al sol.
    */

    if (progreso >= 100 && !terminado) {

        terminado = true;

        setTimeout(() => {

            mensaje.classList.remove(
                "oculto"
            );

        }, 1800);

    }

}

/* =========================
   REINICIAR
========================= */

reiniciar.addEventListener(
    "click",
    () => {

        progreso = 0;

        terminado = false;

        mensaje.classList.add(
            "oculto"
        );

        iniciado = true;

    }
);