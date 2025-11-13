# 🚗 AutoLavado Premium - Sistema de Reservas Online

Sistema web completo para gestionar reservas de lavado de carros con confirmación automática por WhatsApp.

## 🌐 Demo en Vivo
[Ver Demo](https://tu-sitio.netlify.app)

## ✨ Características

- ✅ **Reservas por Hora**: Sistema de agendamiento de 8 AM a 6 PM
- ✅ **4 Tipos de Servicios**: Express, Básico, Completo y Premium
- ✅ **Confirmación WhatsApp**: Envío automático de reserva
- ✅ **Diseño Responsive**: Funciona en móviles, tablets y escritorio
- ✅ **Interfaz Moderna**: Animaciones y efectos visuales atractivos

## 🎯 Servicios Disponibles

1. **Lavado Express** - ₡5,000 (20 minutos)
2. **Lavado Básico** - ₡8,000 (30 minutos)
3. **Lavado Completo** - ₡15,000 (60 minutos) ⭐
4. **Lavado Premium** - ₡25,000 (90 minutos)

## 🚀 Configuración

### 1. Configurar WhatsApp

Abre `script.js` y modifica el número de WhatsApp:

```javascript
const CONFIG = {
    whatsappNumber: '72255624', // Tu número aquí
    horaInicio: 8,
    horaFin: 18,
    intervaloMinutos: 30,
    diasAnticipacion: 30
};
```

### 2. Personalizar Información

En `index.html`, actualiza:
- Nombre del negocio
- Dirección
- Horarios
- Redes sociales

## 📱 Uso

1. El cliente selecciona un servicio
2. Completa el formulario de reserva
3. Hace clic en "Confirmar Reserva por WhatsApp"
4. Se abre WhatsApp con el mensaje pre-llenado
5. Solo debe presionar enviar

## 🛠️ Tecnologías

- HTML5
- CSS3 (Grid, Flexbox, Animaciones)
- JavaScript Vanilla (ES6+)
- Font Awesome (Iconos)
- WhatsApp API

## 📂 Estructura

```
reservas-lavado/
├── index.html          # Página principal
├── styles.css          # Estilos y diseño
├── script.js           # Lógica y funcionalidad
└── README.md          # Documentación
```

## 🎨 Personalización

### Cambiar Colores

Edita las variables CSS en `styles.css`:

```css
:root {
    --primary-color: #4F46E5;
    --secondary-color: #6366F1;
    --success-color: #10B981;
    /* ... más colores */
}
```

### Modificar Servicios

En `index.html`, busca las tarjetas de servicios y edita:
- `data-servicio`: Identificador
- `data-precio`: Precio en colones (₡)
- `data-duracion`: Duración en minutos

## 📄 Licencia

Libre para uso comercial y personal.

---

**Desarrollado con ❤️ para AutoLavado Premium**
