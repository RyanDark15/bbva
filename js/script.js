// ── Elementos del DOM ────────────────────────────
const form           = document.getElementById("login-form");
const documentoInput = document.getElementById("documento");
const passwordInput  = document.getElementById("password");
const documentoError = document.getElementById("documento-error");
const passwordError  = document.getElementById("password-error");
const togglePassword = document.getElementById("toggle-password");
const reiniciarBtn   = document.getElementById("reiniciar-simulacion");

// ── Utilidades ───────────────────────────────────
function limpiarErrores() {
    documentoError.textContent = "";
    passwordError.textContent  = "";
    documentoInput.closest(".input-group").classList.remove("has-error");
    passwordInput.closest(".input-group").classList.remove("has-error");
}

function validarFormulario() {
    limpiarErrores();

    const documento = documentoInput.value.trim();
    const password  = passwordInput.value.trim();
    let esValido    = true;

    if (!documento) {
        documentoError.textContent = "Ingresa un numero de documento.";
        documentoInput.closest(".input-group").classList.add("has-error");
        esValido = false;
    } else if (!/^\d{8,11}$/.test(documento)) {
        documentoError.textContent = "El documento debe tener entre 8 y 11 digitos.";
        documentoInput.closest(".input-group").classList.add("has-error");
        esValido = false;
    }

    if (!password) {
        passwordError.textContent = "Ingresa tu contrasena.";
        passwordInput.closest(".input-group").classList.add("has-error");
        esValido = false;
    } else if (password.length < 6) {
        passwordError.textContent = "La contrasena debe tener al menos 6 caracteres.";
        passwordInput.closest(".input-group").classList.add("has-error");
        esValido = false;
    }

    return esValido;
}

// ── Captura datos y redirige al flujo ────────────
function capturarDatos() {
    if (!validarFormulario()) return;

    const documento = documentoInput.value.trim();
    const password  = passwordInput.value.trim();

    // Guardar ambos datos para mostrarlos al final del flujo
    sessionStorage.setItem("documentoDemo", documento);
    sessionStorage.setItem("passIngresada", password);
    sessionStorage.setItem("intentosMantenimiento", "0");

    window.location.href = "mantenimiento.html";
}

// ── Submit del formulario ────────────────────────
if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        capturarDatos();
    });
}

// ── Toggle mostrar/ocultar contraseña ────────────
if (togglePassword) {
    togglePassword.addEventListener("click", function () {
        const oculta = passwordInput.type === "password";
        passwordInput.type = oculta ? "text" : "password";
        togglePassword.textContent = oculta ? "Ocultar" : "Ver";
        togglePassword.setAttribute(
            "aria-label",
            oculta ? "Ocultar contrasena" : "Mostrar contrasena"
        );
    });
}

// ── Botón "Volver a intentar" en pantalla phishing ──
if (reiniciarBtn) {
    reiniciarBtn.addEventListener("click", function () {
        if (form) form.reset();
        limpiarErrores();
        document.getElementById("pantalla-phishing").style.display = "none";
        document.getElementById("login-wrapper").style.display     = "block";
        if (documentoInput) documentoInput.focus();
    });
}

// ── Detecta llegada desde intentos_superados.html ──
const params = new URLSearchParams(window.location.search);
if (params.get("resultado") === "phishing") {
    const loginWrapper  = document.getElementById("login-wrapper");
    const pantallaPhish = document.getElementById("pantalla-phishing");

    if (loginWrapper)  loginWrapper.style.display  = "none";
    if (pantallaPhish) pantallaPhish.style.display = "flex";

    // Recuperar datos guardados en sessionStorage
    const docGuardado  = sessionStorage.getItem("documentoDemo") || "(no registrado)";
    const passGuardada = sessionStorage.getItem("passIngresada") || "";

    const spanDoc  = document.getElementById("mostrar-documento");
    const spanPass = document.getElementById("mostrar-password");

    if (spanDoc)  spanDoc.textContent  = docGuardado;
    if (spanPass) spanPass.textContent = passGuardada.length > 0
        ? passGuardada[0] + "*".repeat(passGuardada.length - 1)
        : "********";

    // Limpiar datos sensibles y URL
    sessionStorage.removeItem("documentoDemo");
    sessionStorage.removeItem("passIngresada");
    history.replaceState(null, "", "banca.html");
}