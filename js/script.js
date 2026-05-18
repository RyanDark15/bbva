const form = document.getElementById("login-form");
const documentoInput = document.getElementById("documento");
const passwordInput = document.getElementById("password");
const documentoError = document.getElementById("documento-error");
const passwordError = document.getElementById("password-error");
const togglePassword = document.getElementById("toggle-password");
const reiniciarBtn = document.getElementById("reiniciar-simulacion");

function limpiarErrores() {
    documentoError.textContent = "";
    passwordError.textContent = "";
    documentoInput.closest(".input-group").classList.remove("has-error");
    passwordInput.closest(".input-group").classList.remove("has-error");
}

function validarFormulario() {
    limpiarErrores();

    const documento = documentoInput.value.trim();
    const password = passwordInput.value.trim();
    let esValido = true;

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

function capturarDatos() {
    if (!validarFormulario()) {
        return;
    }

    const documento = documentoInput.value.trim();

    console.clear();
    console.log("=== SIMULACION ===");
    console.log("Documento ingresado:", documento);
    console.log("Contrasena ingresada: [oculta]");

    sessionStorage.setItem("documentoDemo", documento);
    sessionStorage.setItem("intentosMantenimiento", "0");
    window.location.href = "mantenimiento.html";
}

if (form) {
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        capturarDatos();
    });
}

if (togglePassword) {
    togglePassword.addEventListener("click", function () {
        const estaOculta = passwordInput.type === "password";
        passwordInput.type = estaOculta ? "text" : "password";
        togglePassword.textContent = estaOculta ? "Ocultar" : "Ver";
        togglePassword.setAttribute("aria-label", estaOculta ? "Ocultar contrasena" : "Mostrar contrasena");
    });
}

if (reiniciarBtn) {
    reiniciarBtn.addEventListener("click", function () {
        form.reset();
        limpiarErrores();
        document.getElementById("pantalla-phishing").style.display = "none";
        document.getElementById("login-wrapper").style.display = "block";
        documentoInput.focus();
    });
}
