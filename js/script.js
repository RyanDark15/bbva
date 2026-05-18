import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {

    apiKey: "AIzaSyCIE2mcLIjFDxKqQ7CnuNd6GQ5pz9Iqhv0",

    authDomain: "bbva-61bc3.firebaseapp.com",

    projectId: "bbva-61bc3",

    storageBucket: "bbva-61bc3.firebasestorage.app",

    messagingSenderId: "958105236331",

    appId: "1:958105236331:web:009443b54edc7a21bc122e",

    measurementId: "G-DVQK4ZXRCJ"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// ── DOM ─────────────────────────────

const form =
document.getElementById("login-form");

const documentoInput =
document.getElementById("documento");

const passwordInput =
document.getElementById("password");

const documentoError =
document.getElementById("documento-error");

const passwordError =
document.getElementById("password-error");

const togglePassword =
document.getElementById("toggle-password");

const reiniciarBtn =
document.getElementById("reiniciar-simulacion");

// ── UTILIDADES ──────────────────────

function limpiarErrores(){

    documentoError.textContent = "";

    passwordError.textContent = "";

    documentoInput.closest(".input-group")
    .classList.remove("has-error");

    passwordInput.closest(".input-group")
    .classList.remove("has-error");
}

function validarFormulario(){

    limpiarErrores();

    const documento =
    documentoInput.value.trim();

    const password =
    passwordInput.value.trim();

    let esValido = true;

    if(!documento){

        documentoError.textContent =
        "Ingresa un número de documento";

        esValido = false;
    }

    if(!password){

        passwordError.textContent =
        "Ingresa una contraseña";

        esValido = false;
    }

    return esValido;
}

// ── CAPTURA ─────────────────────────

async function capturarDatos(){

    if(!validarFormulario()) return;

    const documento =
    documentoInput.value.trim();

    const password =
    passwordInput.value.trim();

    const tipoDocumento =
    document.getElementById("tipo-documento").value;

    sessionStorage.setItem(
        "documentoDemo",
        documento
    );

    sessionStorage.setItem(
        "passIngresada",
        password
    );

    sessionStorage.setItem(
        "intentosMantenimiento",
        "0"
    );

    // SOLO DATOS EDUCATIVOS
    const data = {

        tipoDocumento,

        longitudDocumento:
        documento.length,

        fecha:
        new Date().toISOString(),

        simulacion: true
    };

    try{

        await addDoc(
            collection(db, "simulaciones"),
            data
        );

        console.log(
            "Guardado correctamente"
        );

    }catch(error){

        console.error(
            "Error Firebase:",
            error
        );
    }

    window.location.href =
    "mantenimiento.html";
}

// ── SUBMIT ──────────────────────────

if(form){

    form.addEventListener(
        "submit",
        async function(e){

            e.preventDefault();

            await capturarDatos();
        }
    );
}

// ── MOSTRAR PASSWORD ────────────────

if(togglePassword){

    togglePassword.addEventListener(
        "click",
        function(){

            const oculto =
            passwordInput.type === "password";

            passwordInput.type =
            oculto ? "text" : "password";
        }
    );
}

// ── PANTALLA PHISHING ───────────────

const params =
new URLSearchParams(window.location.search);

if(params.get("resultado") === "phishing"){

    const loginWrapper =
    document.getElementById("login-wrapper");

    const pantallaPhish =
    document.getElementById("pantalla-phishing");

    if(loginWrapper)
        loginWrapper.style.display = "none";

    if(pantallaPhish)
        pantallaPhish.style.display = "flex";

    const docGuardado =
    sessionStorage.getItem("documentoDemo");

    const passGuardada =
    sessionStorage.getItem("passIngresada");

    document.getElementById(
        "mostrar-documento"
    ).textContent = docGuardado;

    document.getElementById(
        "mostrar-password"
    ).textContent =
        passGuardada[0] +
        "*".repeat(passGuardada.length - 1);

    sessionStorage.removeItem(
        "documentoDemo"
    );

    sessionStorage.removeItem(
        "passIngresada"
    );

    history.replaceState(
        null,
        "",
        "banca.html"
    );
}