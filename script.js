/* ==========================================================================
   GAMER FEST ESPE 2027 - JavaScript personalizado (sin backend)
   - Menú móvil y resaltado de la sección activa
   - Validación local del formulario de inscripción
   - Confirmación de demostración
   Los datos del formulario NO se envían, NO se guardan y NO se leen
   desde disco: del archivo adjunto solo se consulta nombre, tipo y tamaño.
   ========================================================================== */
(function () {
    'use strict';

    /* ---------------------------------------------------------------
       1. Menú de navegación
       --------------------------------------------------------------- */
    var menu = document.getElementById('menuPrincipal');

    // Al elegir un enlace en el menú móvil, el menú se cierra y DESPUÉS se
    // desplaza a la sección (así la posición final no queda desfasada).
    if (menu && window.bootstrap) {
        menu.querySelectorAll('a.nav-link').forEach(function (enlace) {
            enlace.addEventListener('click', function (evento) {
                if (!menu.classList.contains('show')) { return; }
                var destino = document.querySelector(enlace.getAttribute('href'));
                if (!destino) { return; }
                evento.preventDefault();
                menu.addEventListener('hidden.bs.collapse', function () {
                    destino.scrollIntoView();
                    if (window.history && window.history.replaceState) {
                        window.history.replaceState(null, '', enlace.getAttribute('href'));
                    }
                }, { once: true });
                window.bootstrap.Collapse.getOrCreateInstance(menu).hide();
            });
        });
    }

    // Resalta en el menú la sección que se está viendo.
    if (window.bootstrap && window.bootstrap.ScrollSpy) {
        window.bootstrap.ScrollSpy.getOrCreateInstance(document.body, {
            target: '#menuPrincipal',
            rootMargin: '-30% 0px -60% 0px'
        });
    }

    // El enlace de TikTok es demostrativo: no debe saltar ni salir de la página.
    document.querySelectorAll('[data-enlace-demo]').forEach(function (enlace) {
        enlace.addEventListener('click', function (evento) {
            evento.preventDefault();
        });
    });

    /* ---------------------------------------------------------------
       2. Formulario de inscripción
       --------------------------------------------------------------- */
    var formulario = document.getElementById('formInscripcion');
    if (!formulario) { return; }

    var TAMANO_MAXIMO = 2 * 1024 * 1024;            // 2 MB
    var DOMINIO_PERMITIDO = 'espe.edu.ec';
    var EXTENSIONES = ['pdf', 'jpg', 'jpeg', 'png'];
    var TIPOS_MIME = ['application/pdf', 'image/jpeg', 'image/png'];
    var PATRON_NOMBRE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:[ '\-][A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/;
    var PATRON_USUARIO_CORREO = /^[A-Za-z0-9._%+\-]+$/;
    var PATRON_GAMERTAG = /^[A-Za-z0-9_.\-]{3,20}$/;

    var resumen = document.getElementById('resumenErrores');
    var intentoDeEnvio = false;

    function valorDe(campo) {
        return campo.value.trim();
    }

    function formatearMB(bytes) {
        return (Math.ceil(bytes / (1024 * 1024) * 100) / 100).toFixed(2).replace('.', ',');
    }

    // Cada validador devuelve un mensaje de error, o '' si el campo es válido.
    var validadores = {
        nombres: function (campo) {
            var v = valorDe(campo);
            if (!v) { return 'Escribe tus nombres.'; }
            if (v.length < 2 || v.length > 60 || !PATRON_NOMBRE.test(v)) {
                return 'Usa solo letras y espacios (mínimo 2 caracteres).';
            }
            return '';
        },
        apellidos: function (campo) {
            var v = valorDe(campo);
            if (!v) { return 'Escribe tus apellidos.'; }
            if (v.length < 2 || v.length > 60 || !PATRON_NOMBRE.test(v)) {
                return 'Usa solo letras y espacios (mínimo 2 caracteres).';
            }
            return '';
        },
        correo: function (campo) {
            var v = valorDe(campo).toLowerCase();
            if (!v) { return 'Escribe tu correo institucional.'; }
            var arroba = v.lastIndexOf('@');
            if (arroba < 1 || v.indexOf('@') !== arroba || !PATRON_USUARIO_CORREO.test(v.slice(0, arroba))) {
                return 'El correo no tiene un formato válido. Ejemplo: usuario@espe.edu.ec.';
            }
            if (v.slice(arroba + 1) !== DOMINIO_PERMITIDO) {
                return 'Solo se aceptan correos institucionales @espe.edu.ec.';
            }
            return '';
        },
        telefono: function (campo) {
            var v = valorDe(campo).replace(/[\s\-]/g, '');
            if (!v) { return 'Escribe tu número de celular.'; }
            if (!/^09\d{8}$/.test(v)) {
                return 'El celular debe tener 10 dígitos y empezar con 09.';
            }
            return '';
        },
        gamertag: function (campo) {
            var v = valorDe(campo);
            if (!v) { return 'Escribe tu nombre de jugador.'; }
            if (!PATRON_GAMERTAG.test(v)) {
                return 'Usa de 3 a 20 caracteres: letras, números, punto, guion o guion bajo.';
            }
            return '';
        },
        categoria: function (campo) {
            return campo.value ? '' : 'Elige una categoría.';
        },
        equipo: function (campo) {
            var v = valorDe(campo);
            if (v && (v.length < 2 || v.length > 40)) {
                return 'El nombre del equipo debe tener entre 2 y 40 caracteres.';
            }
            return '';
        },
        comprobante: function (campo) {
            var archivo = campo.files && campo.files[0];
            if (!archivo) {
                return 'Adjunta tu comprobante en PDF, JPG o PNG (máximo 2 MB).';
            }
            var partes = archivo.name.toLowerCase().split('.');
            var extension = partes.length > 1 ? partes.pop() : '';
            var extensionValida = EXTENSIONES.indexOf(extension) !== -1;
            var tipoValido = archivo.type === '' || TIPOS_MIME.indexOf(archivo.type) !== -1;
            if (!extensionValida || !tipoValido) {
                return 'Formato no permitido. Sube un archivo PDF, JPG o PNG.';
            }
            if (archivo.size === 0) {
                return 'El archivo está vacío. Elige otro archivo.';
            }
            if (archivo.size > TAMANO_MAXIMO) {
                return 'El archivo pesa ' + formatearMB(archivo.size) + ' MB y el máximo permitido es 2 MB.';
            }
            return '';
        },
        terminos: function (campo) {
            return campo.checked ? '' : 'Debes aceptar el reglamento para continuar.';
        }
    };

    var ordenCampos = ['nombres', 'apellidos', 'correo', 'telefono', 'gamertag',
                       'categoria', 'equipo', 'comprobante', 'terminos'];

    function etiquetaDe(id) {
        var etiqueta = formulario.querySelector('label[for="' + id + '"]');
        if (!etiqueta) { return id; }
        return etiqueta.textContent.replace(/\(opcional\)/i, '').replace(/\s+/g, ' ').trim();
    }

    function marcarCampo(campo, mensaje) {
        var error = document.getElementById('error-' + campo.id);
        var opcionalVacio = campo.id === 'equipo' && !valorDe(campo);
        if (error) { error.textContent = mensaje; }

        campo.classList.remove('is-valid', 'is-invalid');
        if (mensaje) {
            campo.classList.add('is-invalid');
            campo.setAttribute('aria-invalid', 'true');
        } else {
            campo.setAttribute('aria-invalid', 'false');
            if (!opcionalVacio && campo.type !== 'checkbox') {
                campo.classList.add('is-valid');
            }
        }
    }

    function validarCampo(id) {
        var campo = document.getElementById(id);
        var mensaje = validadores[id](campo);
        marcarCampo(campo, mensaje);
        return mensaje;
    }

    function actualizarResumen(errores) {
        if (!errores.length) {
            resumen.classList.add('d-none');
            resumen.textContent = '';
            return;
        }
        resumen.textContent = '';
        var titulo = document.createElement('strong');
        titulo.textContent = errores.length === 1
            ? 'Revisa 1 campo antes de enviar:'
            : 'Revisa ' + errores.length + ' campos antes de enviar:';
        resumen.appendChild(titulo);

        var lista = document.createElement('ul');
        errores.forEach(function (item) {
            var li = document.createElement('li');
            var enlace = document.createElement('a');
            enlace.href = '#' + item.id;
            enlace.textContent = etiquetaDe(item.id) + ': ' + item.mensaje;
            enlace.addEventListener('click', function (evento) {
                evento.preventDefault();
                document.getElementById(item.id).focus();
            });
            li.appendChild(enlace);
            lista.appendChild(li);
        });
        resumen.appendChild(lista);
        resumen.classList.remove('d-none');
    }

    function validarTodo() {
        var errores = [];
        ordenCampos.forEach(function (id) {
            var mensaje = validarCampo(id);
            if (mensaje) { errores.push({ id: id, mensaje: mensaje }); }
        });
        return errores;
    }

    function recalcularResumen() {
        if (resumen.classList.contains('d-none')) { return; }
        var errores = [];
        ordenCampos.forEach(function (id) {
            var mensaje = validadores[id](document.getElementById(id));
            if (mensaje) { errores.push({ id: id, mensaje: mensaje }); }
        });
        actualizarResumen(errores);
    }

    // Validación mientras la persona completa el formulario
    ordenCampos.forEach(function (id) {
        var campo = document.getElementById(id);
        var esTextual = campo.tagName === 'INPUT' && campo.type !== 'file' && campo.type !== 'checkbox';

        if (esTextual) {
            campo.addEventListener('blur', function () {
                if (intentoDeEnvio || valorDe(campo)) {
                    validarCampo(id);
                    recalcularResumen();
                }
            });
            campo.addEventListener('input', function () {
                if (campo.classList.contains('is-invalid')) {
                    validarCampo(id);
                    recalcularResumen();
                }
            });
        } else {
            campo.addEventListener('change', function () {
                validarCampo(id);
                recalcularResumen();
            });
        }
    });

    function limpiarEstados() {
        ordenCampos.forEach(function (id) {
            var campo = document.getElementById(id);
            campo.classList.remove('is-valid', 'is-invalid');
            campo.removeAttribute('aria-invalid');
            var error = document.getElementById('error-' + id);
            if (error) { error.textContent = ''; }
        });
        actualizarResumen([]);
        intentoDeEnvio = false;
    }

    /* ---------------------------------------------------------------
       3. Envío (demostración): valida y confirma, sin enviar nada
       --------------------------------------------------------------- */
    var modalElemento = document.getElementById('modalConfirmacion');
    var mensajeConfirmacion = document.getElementById('mensajeConfirmacion');

    formulario.addEventListener('submit', function (evento) {
        evento.preventDefault();   // nunca se transmite el formulario
        intentoDeEnvio = true;

        var errores = validarTodo();
        if (errores.length) {
            actualizarResumen(errores);
            resumen.focus();
            resumen.scrollIntoView({ block: 'center' });
            return;
        }

        var nombre = valorDe(document.getElementById('nombres'));
        var categoria = document.getElementById('categoria').value;
        mensajeConfirmacion.textContent =
            'Gracias, ' + nombre + '. Tu inscripción en la categoría ' + categoria +
            ' pasó todas las validaciones.';

        formulario.reset();
        limpiarEstados();

        if (window.bootstrap && modalElemento) {
            window.bootstrap.Modal.getOrCreateInstance(modalElemento).show();
        }
    });

    formulario.addEventListener('reset', function () {
        limpiarEstados();
    });
})();
