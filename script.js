// Configuración global
const CONFIG = {
    whatsappNumber: '72255624', // Tu número de WhatsApp (formato: código país + número sin +)
    horaInicio: 8, // 8 AM
    horaFin: 18, // 6 PM
    intervaloMinutos: 30,
    diasAnticipacion: 30 // Días que se pueden reservar hacia adelante
};

// Estado de la aplicación
let reservaActual = {
    servicio: null,
    precio: 0,
    duracion: 0,
    nombre: '',
    telefono: '',
    email: '',
    fecha: '',
    hora: '',
    vehiculo: '',
    placa: '',
    comentarios: ''
};

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    inicializarFechas();
    inicializarHoras();
    configurarEventos();
});

// Configurar todos los event listeners
function configurarEventos() {
    // Selección de servicios
    const botonesSeleccionar = document.querySelectorAll('.btn-seleccionar');
    botonesSeleccionar.forEach(boton => {
        boton.addEventListener('click', function() {
            const card = this.closest('.servicio-card');
            seleccionarServicio(card);
        });
    });

    // Hacer clic en toda la tarjeta también selecciona el servicio
    const servicioCards = document.querySelectorAll('.servicio-card');
    servicioCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('btn-seleccionar')) {
                seleccionarServicio(card);
            }
        });
    });

    // Formulario de reserva
    const form = document.getElementById('reservaForm');
    form.addEventListener('submit', enviarReserva);

    // Validación en tiempo real
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validarCampo(this);
        });
    });

    // Actualizar horas disponibles cuando cambie la fecha
    document.getElementById('fecha').addEventListener('change', function() {
        actualizarHorasDisponibles();
    });

    // Smooth scroll para los enlaces del menú
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Seleccionar servicio
function seleccionarServicio(card) {
    // Remover selección anterior
    document.querySelectorAll('.servicio-card').forEach(c => {
        c.classList.remove('selected');
    });

    // Seleccionar nueva tarjeta
    card.classList.add('selected');

    // Guardar datos del servicio
    reservaActual.servicio = card.dataset.servicio;
    reservaActual.precio = parseInt(card.dataset.precio);
    reservaActual.duracion = parseInt(card.dataset.duracion);

    // Actualizar resumen
    actualizarResumen();

    // Scroll al formulario
    document.getElementById('reservar').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Actualizar resumen del servicio seleccionado
function actualizarResumen() {
    const resumen = document.getElementById('servicio-seleccionado');
    
    if (reservaActual.servicio) {
        const nombreServicio = reservaActual.servicio
            .split('-')
            .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
            .join(' ');

        resumen.innerHTML = `
            <h4>${nombreServicio}</h4>
            <div class="detalle">
                <span>Duración:</span>
                <span>${reservaActual.duracion} minutos</span>
            </div>
            <div class="detalle">
                <span>Precio:</span>
                <span>₡${reservaActual.precio.toLocaleString('es-CR')}</span>
            </div>
            <div class="detalle-precio">
                Total: ₡${reservaActual.precio.toLocaleString('es-CR')}
            </div>
        `;
        resumen.classList.add('activo');

        // Actualizar precio total en el formulario
        document.getElementById('totalPrecio').textContent = 
            `₡${reservaActual.precio.toLocaleString('es-CR')}`;
    } else {
        resumen.innerHTML = '<p class="placeholder">Selecciona un servicio arriba</p>';
        resumen.classList.remove('activo');
    }
}

// Inicializar fechas disponibles
function inicializarFechas() {
    const inputFecha = document.getElementById('fecha');
    const hoy = new Date();
    
    // Fecha mínima: mañana
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);
    inputFecha.min = formatearFechaInput(manana);
    
    // Fecha máxima: días de anticipación configurados
    const fechaMax = new Date(hoy);
    fechaMax.setDate(fechaMax.getDate() + CONFIG.diasAnticipacion);
    inputFecha.max = formatearFechaInput(fechaMax);
}

// Generar horas disponibles
function inicializarHoras() {
    const selectHora = document.getElementById('hora');
    selectHora.innerHTML = '<option value="">Seleccionar hora</option>';
    
    const horas = generarHorasDisponibles();
    horas.forEach(hora => {
        const option = document.createElement('option');
        option.value = hora;
        option.textContent = hora;
        selectHora.appendChild(option);
    });
}

// Generar array de horas disponibles
function generarHorasDisponibles() {
    const horas = [];
    let horaActual = CONFIG.horaInicio;
    let minutos = 0;
    
    while (horaActual < CONFIG.horaFin) {
        const horaStr = `${horaActual.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
        horas.push(horaStr);
        
        minutos += CONFIG.intervaloMinutos;
        if (minutos >= 60) {
            minutos = 0;
            horaActual++;
        }
    }
    
    return horas;
}

// Actualizar horas disponibles según la fecha seleccionada
function actualizarHorasDisponibles() {
    const fechaSeleccionada = document.getElementById('fecha').value;
    const selectHora = document.getElementById('hora');
    
    if (!fechaSeleccionada) return;
    
    const fechaReserva = new Date(fechaSeleccionada + 'T00:00:00');
    const hoy = new Date();
    
    // Si es hoy, filtrar horas pasadas
    if (fechaReserva.toDateString() === hoy.toDateString()) {
        const horaActual = hoy.getHours();
        const minutosActuales = hoy.getMinutes();
        
        Array.from(selectHora.options).forEach(option => {
            if (option.value) {
                const [hora, minutos] = option.value.split(':').map(Number);
                const esPasada = hora < horaActual || 
                    (hora === horaActual && minutos <= minutosActuales);
                option.disabled = esPasada;
            }
        });
    } else {
        // Habilitar todas las opciones para fechas futuras
        Array.from(selectHora.options).forEach(option => {
            option.disabled = false;
        });
    }
}

// Validar campo individual
function validarCampo(campo) {
    const formGroup = campo.closest('.form-group');
    let errorMsg = formGroup.querySelector('.error-message');
    
    if (!errorMsg) {
        errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        formGroup.appendChild(errorMsg);
    }
    
    let esValido = true;
    let mensaje = '';
    
    // Validaciones específicas
    if (campo.hasAttribute('required') && !campo.value.trim()) {
        esValido = false;
        mensaje = 'Este campo es obligatorio';
    } else if (campo.type === 'email' && campo.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(campo.value)) {
            esValido = false;
            mensaje = 'Email inválido';
        }
    } else if (campo.type === 'tel') {
        const telefonoLimpio = campo.value.replace(/\s/g, '');
        if (telefonoLimpio.length < 10) {
            esValido = false;
            mensaje = 'Teléfono inválido (mínimo 10 dígitos)';
        }
    }
    
    // Aplicar estilos de error
    if (!esValido) {
        formGroup.classList.add('error');
        errorMsg.textContent = mensaje;
    } else {
        formGroup.classList.remove('error');
        errorMsg.textContent = '';
    }
    
    return esValido;
}

// Validar formulario completo
function validarFormulario() {
    const form = document.getElementById('reservaForm');
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let esValido = true;
    
    // Validar que se haya seleccionado un servicio
    if (!reservaActual.servicio) {
        alert('Por favor selecciona un servicio antes de continuar');
        document.getElementById('servicios').scrollIntoView({ behavior: 'smooth' });
        return false;
    }
    
    inputs.forEach(input => {
        if (!validarCampo(input)) {
            esValido = false;
        }
    });
    
    return esValido;
}

// Enviar reserva por WhatsApp
function enviarReserva(e) {
    e.preventDefault();
    
    if (!validarFormulario()) {
        return;
    }
    
    // Recopilar datos del formulario
    reservaActual.nombre = document.getElementById('nombre').value.trim();
    reservaActual.telefono = document.getElementById('telefono').value.trim();
    reservaActual.email = document.getElementById('email').value.trim();
    reservaActual.fecha = document.getElementById('fecha').value;
    reservaActual.hora = document.getElementById('hora').value;
    reservaActual.vehiculo = document.getElementById('vehiculo').value.trim();
    reservaActual.placa = document.getElementById('placa').value.trim().toUpperCase();
    reservaActual.comentarios = document.getElementById('comentarios').value.trim();
    
    // Formatear fecha
    const fecha = new Date(reservaActual.fecha + 'T00:00:00');
    const fechaFormateada = fecha.toLocaleDateString('es-CO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Nombre del servicio formateado
    const nombreServicio = reservaActual.servicio
        .split('-')
        .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
        .join(' ');
    
    // Crear mensaje para WhatsApp
    let mensaje = `🚗 *NUEVA RESERVA - AUTOLAVADO PREMIUM* 🚗\n\n`;
    mensaje += `👤 *Cliente:* ${reservaActual.nombre}\n`;
    mensaje += `📱 *Teléfono:* ${reservaActual.telefono}\n`;
    
    if (reservaActual.email) {
        mensaje += `📧 *Email:* ${reservaActual.email}\n`;
    }
    
    mensaje += `\n🧼 *Servicio:* ${nombreServicio}\n`;
    mensaje += `💰 *Precio:* ₡${reservaActual.precio.toLocaleString('es-CR')}\n`;
    mensaje += `⏱️ *Duración:* ${reservaActual.duracion} minutos\n`;
    mensaje += `\n📅 *Fecha:* ${fechaFormateada}\n`;
    mensaje += `🕐 *Hora:* ${reservaActual.hora}\n`;
    mensaje += `\n🚙 *Vehículo:* ${reservaActual.vehiculo}\n`;
    
    if (reservaActual.placa) {
        mensaje += `🔖 *Placa:* ${reservaActual.placa}\n`;
    }
    
    if (reservaActual.comentarios) {
        mensaje += `\n💬 *Comentarios:*\n${reservaActual.comentarios}\n`;
    }
    
    mensaje += `\n✅ *Por favor confirme esta reserva*`;
    
    // Codificar mensaje para URL
    const mensajeCodificado = encodeURIComponent(mensaje);
    
    // Crear URL de WhatsApp
    const urlWhatsApp = `https://wa.me/${CONFIG.whatsappNumber}?text=${mensajeCodificado}`;
    
    // Guardar reserva en localStorage
    guardarReservaLocal();
    
    // Abrir WhatsApp
    window.open(urlWhatsApp, '_blank');
    
    // Mostrar mensaje de confirmación
    mostrarMensajeExito();
}

// Guardar reserva en localStorage
function guardarReservaLocal() {
    const reservas = JSON.parse(localStorage.getItem('reservas') || '[]');
    reservas.push({
        ...reservaActual,
        id: Date.now(),
        fechaCreacion: new Date().toISOString()
    });
    localStorage.setItem('reservas', JSON.stringify(reservas));
}

// Mostrar mensaje de éxito
function mostrarMensajeExito() {
    const form = document.getElementById('reservaForm');
    
    // Crear mensaje
    const mensajeDiv = document.createElement('div');
    mensajeDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 2rem;
        border-radius: 15px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        text-align: center;
        max-width: 400px;
    `;
    
    mensajeDiv.innerHTML = `
        <i class="fas fa-check-circle" style="font-size: 4rem; color: #10b981; margin-bottom: 1rem;"></i>
        <h3 style="margin-bottom: 1rem; color: #1f2937;">¡Reserva Enviada!</h3>
        <p style="color: #6b7280; margin-bottom: 1.5rem;">
            Tu solicitud de reserva ha sido enviada por WhatsApp. 
            Te confirmaremos en breve.
        </p>
        <button id="cerrarMensaje" style="
            padding: 10px 30px;
            background: #2563eb;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
        ">Entendido</button>
    `;
    
    // Overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 9999;
    `;
    
    document.body.appendChild(overlay);
    document.body.appendChild(mensajeDiv);
    
    // Cerrar mensaje
    const cerrarMensaje = () => {
        document.body.removeChild(mensajeDiv);
        document.body.removeChild(overlay);
        
        // Resetear formulario
        form.reset();
        reservaActual.servicio = null;
        reservaActual.precio = 0;
        reservaActual.duracion = 0;
        
        // Remover selección de servicio
        document.querySelectorAll('.servicio-card').forEach(c => {
            c.classList.remove('selected');
        });
        
        actualizarResumen();
        
        // Scroll al inicio
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    document.getElementById('cerrarMensaje').addEventListener('click', cerrarMensaje);
    overlay.addEventListener('click', cerrarMensaje);
}

// Formatear fecha para input
function formatearFechaInput(fecha) {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Función para obtener reservas guardadas (útil para futuras mejoras)
function obtenerReservas() {
    return JSON.parse(localStorage.getItem('reservas') || '[]');
}
