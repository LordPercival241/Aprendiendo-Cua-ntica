#  Plataforma de Mecánica Cuántica IF411

Plataforma web educativa para el curso **IF411 (Mecánica Cuántica)** de la **Facultad de Ciencias de la Universidad Nacional de Ingeniería (UNI)**. Integra teoría rigurosa alineada al sílabo, renderizado matemático KaTeX, simulaciones interactivas, ciclo POE (Predecir-Observar-Explicar) y analítica de aprendizaje.

---

##  Guía de Ejecución Local

### 1. Requisitos Previos
- **Node.js**: v18.18.0 o superior (recomendado v20+ o v24+)
- **npm**: v9.0.0 o superior
- Terminal: PowerShell, Bash o Command Prompt

Verifica tus versiones instaladas:
```bash
node -v
npm -v
```

---

### 2. Pasos para Iniciar el Proyecto

#### Paso 1: Ingresar a la subcarpeta del proyecto
Abre tu terminal y navega al directorio `quantum-uni`:
```bash
cd "c:\Users\USUARIO\proyectos\Aprendiendo Cuántica\quantum-uni"
```

#### Paso 2: Instalar dependencias (solo necesario la primera vez o tras clonar)
```bash
npm install
```

#### Paso 3: Configurar variables de entorno (opcional para desarrollo local)
Crea una copia del archivo `.env.local.example` con el nombre `.env.local`:
```bash
# En Windows PowerShell:
Copy-Item .env.local.example .env.local
```
*(El proyecto funciona perfectamente en modo local sin configurar Supabase/PostHog gracias a los valores por defecto).*

#### Paso 4: Iniciar el servidor de desarrollo
```bash
npm run dev
```

#### Paso 5: Abrir en el navegador
Una vez iniciado el servidor, abre tu navegador web e ingresa a:

👉 **[http://localhost:3000](http://localhost:3000)** (te redirigirá automáticamente a `/es`)  
👉 **[http://localhost:3000/es](http://localhost:3000/es)** (Versión en Español)  
👉 **[http://localhost:3000/en](http://localhost:3000/en)** (Versión en Inglés)

---

##  Comandos Disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo en `http://localhost:3000` con Turbopack y recarga en caliente (HMR). |
| `npm run build` | Compila la aplicación optimizada para producción verificando tipos de TypeScript y generando rutas estáticas (SSG). |
| `npm run start` | Inicia el servidor de producción local (requiere haber ejecutado `npm run build` antes). |
| `npm run lint` | Ejecuta el linter ESLint para detectar posibles errores de código. |

---

##  Rutas Principales de la Aplicación

- **Inicio**: `http://localhost:3000/es` — Portada con física de partículas, métricas y resumen del sílabo.
- **Módulos**: `http://localhost:3000/es/modulos` — Índice de las 13 unidades temáticas.
- **Detalle de Módulo**: `http://localhost:3000/es/modulos/01-introduccion-fisica-moderna` — Lección con teoría completa, inspector de fórmulas, ciclo POE y diapositivas.
- **Recursos Académicos**: `http://localhost:3000/es/recursos` — Visor integrado para las 14 semanas de diapositivas y libros clásicos.
- **Dashboard de Progreso**: `http://localhost:3000/es/progreso` — Seguimiento de retos y cálculo de Ganancia de Hake $\langle g \rangle$.

---

##  Características Implementadas

-  **Internacionalización Bilingüe (i18n)**: Español 🇪🇸 (por defecto) e Inglés 🇬🇧 mediante `next-intl`.
-  **Modo Oscuro / Claro**: Alternador con `next-themes` y paleta de colores de alto contraste.
-  **Renderizado Matemático Riguroso**: Ecuaciones complejas renderizadas con KaTeX.
- 🔍 **Inspector Minucioso de Fórmulas**: Desglose término por término con unidades físicas, rol e interpretación.
- 📄 **Visor PDF Integrado**: Acceso directo a diapositivas del profesor y libros de texto clásicos.
