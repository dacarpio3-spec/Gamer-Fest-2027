# GAMER FEST ESPE 2027 - Landing page

Landing page responsiva (Mobile First) de un evento gamer universitario **hipotético**.
Proyecto académico de Programación Web, basado en la ERS `ERS-GF-2027`.

## Tecnologías
HTML5, CSS3, Bootstrap 5.3 (local) y JavaScript de cliente. No usa backend.

## Cómo ejecutarlo
1. Descarga o clona la carpeta del proyecto.
2. Abre `index.html` en un navegador actual (Chrome, Edge o Firefox).
3. Para ver el mapa necesitas conexión a Internet. Sin conexión se conservan la dirección escrita y el botón «Abrir en Google Maps».

## Estructura
```
GamerFest/
├── index.html          Página única con header, 6 secciones y footer
├── style.css           Estilos personalizados (Mobile First, breakpoint lg)
├── script.js           Menú, validación del formulario y confirmación
├── bootstrap/          Bootstrap 5.3 local (css y js)
└── assets/
    ├── fonts/          Anton y Barlow (licencia OFL), subconjunto latino
    └── img/            logo/, categorias/ y auspiciantes/
```

## Secciones
Inicio (invitación e información), Categorías, Premios, Auspiciantes, Ubicación (mapa), Inscripción (formulario) y pie de página con redes.

## Formulario de inscripción (demostración)
Valida en el navegador y **no envía ni guarda datos**. Usa siempre datos ficticios.

| Campo | Regla |
|---|---|
| Nombres y apellidos | Solo letras y espacios, de 2 a 60 caracteres |
| Correo institucional | Obligatorio; solo dominio `@espe.edu.ec` |
| Celular | 10 dígitos, empieza con `09` |
| Gamertag | De 3 a 20 caracteres (letras, números, `.`, `-`, `_`) |
| Categoría | Obligatoria (MOBA, Deportes, FPS o Battle Royale) |
| Nombre del equipo | Opcional, de 2 a 40 caracteres |
| Comprobante | Obligatorio; PDF, JPG o PNG; máximo 2 MB |
| Reglamento | Casilla obligatoria |

Si todo es válido se muestra una ventana de confirmación de demostración y el formulario se reinicia.

## Notas
- Fecha, horario, premios y auspiciantes son datos de demostración, no anuncios oficiales.
- El enlace de TikTok es ficticio y no lleva a ninguna cuenta.
- Los logos de auspiciantes se usan solo con fines académicos.
