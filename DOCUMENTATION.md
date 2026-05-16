# Documentación del Proyecto Idenza

## 1. Visión General
**Idenza** es una plataforma web desarrollada para "Arquitectos de Experiencias Digitales". El proyecto fusiona ingeniería de software con estética de vanguardia para ofrecer productos digitales que inspiran. La aplicación es una Single-Page Application (SPA) moderna, rápida y altamente interactiva.

## 2. Tecnologías (Tech Stack)
El proyecto está construido utilizando las últimas tecnologías en el ecosistema de React:

-   **Core**: [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
-   **Build Tool**: [Vite](https://vitejs.dev/) (para un desarrollo rápido y builds optimizados)
-   **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
-   **Componentes UI**: [shadcn/ui](https://ui.shadcn.com/) (basado en Radix UI)
-   **Enrutamiento**: [React Router DOM](https://reactrouter.com/)
-   **Animaciones**: [Framer Motion](https://www.framer.com/motion/)
-   **Gestión de Estado/Datos**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
-   **Formularios**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) (validación)

## 3. Estructura del Proyecto

La estructura de directorios sigue las mejores prácticas modernas de React:

```
/
├── public/              # Archivos estáticos públicos
├── src/
│   ├── assets/          # Imágenes, fuentes y otros recursos estáticos
│   ├── components/      # Componentes de React
│   │   ├── idenza/      # Componentes específicos del negocio (Brand, Secciones)
│   │   └── ui/          # Componentes reutilizables de shadcn (Botones, Inputs, etc.)
│   ├── hooks/           # Custom Hooks personalizados
│   ├── lib/             # Utilidades y funciones auxiliares (ej. utils.ts)
│   ├── pages/           # Vistas principales de la aplicación (Rutas)
│   ├── App.tsx          # Componente raíz con configuración de Rutas y Providers
│   ├── main.tsx         # Punto de entrada de la aplicación
│   └── index.css        # Estilos globales y configuración de Tailwind
├── .gitignore           # Archivos ignorados por Git
├── index.html           # Template HTML principal
├── package.json         # Dependencias y scripts del proyecto
├── tailwind.config.ts   # Configuración de Tailwind CSS
├── tsconfig.json        # Configuración de TypeScript
└── vite.config.ts       # Configuración de Vite
```

## 4. Arquitectura y Características Clave

### Enrutamiento (Routing)
El proyecto utiliza `react-router-dom` con **Lazy Loading** para optimizar el rendimiento. Las páginas se cargan bajo demanda (Code Splitting).

-   **/**: Página de inicio (`Index.tsx`)
-   **/nosotros**: Información sobre la empresa (`Nosotros.tsx`)
-   **/proyectos**: Portafolio de trabajos (`Proyectos.tsx`)
-   **/launchpad**: Página de contacto y lanzamiento (`Launchpad.tsx`)
-   **/planes**: Oferta de precios y planes (`Planes.tsx`)
-   **\***: Página 404 (`NotFound.tsx`)

### Componentes UI
Se utiliza una arquitectura de componentes dividida en:
-   **UI (Generic)**: Componentes atómicos y moleculares altamente reutilizables (`src/components/ui`), como `Button`, `Dialog`, `Toaster`.
-   **Idenza (Specific)**: Componentes complejos y secciones específicas del sitio (`src/components/idenza`), como `DesignManifesto`, `Meteors` (animaciones), `ServicesSection`.

### Características Especiales
-   **Hidden Gift**: Un componente (`HiddenGift.tsx`) que sugiere la existencia de "Easter eggs" o funcionalidades ocultas para sorprender al usuario.
-   **Motor de Precios Dinámico**: Sistema de precios en `Planes.tsx` que soporta precios base, precios de oferta (tachados) y aplicación de cupones de descuento con cálculo en tiempo real.
-   **Animaciones**: Uso intensivo de `Framer Motion` para transiciones suaves y efectos visuales atractivos (ej. `Meteors.tsx`).
-   **Performance**: Uso de `<Suspense>` y `PageLoader` para mejorar la experiencia de usuario durante la carga de rutas.

## 5. Instalación y Configuración

### Prerrequisitos
-   [Node.js](https://nodejs.org/) (Versión recomendada: LTS)
-   npm o bun

### Pasos para iniciar
1.  **Clonar el repositorio**:
    ```bash
    git clone https://github.com/tu-usuario/idenza.git
    cd idenza
    ```

2.  **Instalar dependencias**:
    ```bash
    npm install
    # o
    bun install
    ```

3.  **Iniciar servidor de desarrollo**:
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:8080` (o el puerto que asigne Vite).

4.  **Construir para producción**:
    ```bash
    npm run build
    ```
    Esto generará la carpeta `dist/` lista para desplegar.

## 6. Despliegue (Deployment)

El proyecto es estático y puede desplegarse fácilmente en cualquier proveedor de hosting estático moderno.

-   **Vercel / Netlify**:
    El proyecto incluye configuración para integración continua. Simplemente conecta tu repositorio de GitHub y Vercel detectará automáticamente que es un proyecto Vite.
    *Nota: Si usas rutas del lado del cliente (React Router), asegúrate de configurar las reglas de reescritura (rewrite) para redirigir todas las peticiones a `index.html`.*

---
*Documentación generada automáticamente por Idenza AI Assistant. Última actualización: Febrero 2026.*
