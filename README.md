# 🚀 (U)Boost scientific paper 📝✨

![Version](https://img.shields.io/badge/version-1.5.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)
![AWS](https://img.shields.io/badge/AWS-S3-FF9900?logo=amazon-aws)
![OpenAI](https://img.shields.io/badge/OpenAI-API-7A2723?logo=openai)
![Anthropic](https://img.shields.io/badge/Anthropic-Claude-623CE4?logo=anthropic)
![Resend](https://img.shields.io/badge/Resend-Email-00C3FF?logo=resend)

**(U)Boost scientific paper** es una potente aplicación web para procesar, analizar y generar contenido académico a partir de artículos científicos en formato PDF. Utiliza tecnología RAG (Retrieval Augmented Generation) junto a modelos avanzados de OpenAI (GPT-4o, GPT-4o-mini) y Anthropic (Claude 3.7 Sonnet), proporcionando análisis detallados y precisos con una interfaz moderna y amigable basada en Material-UI.

<p align="center">
  <b>Sistema avanzado de procesamiento, análisis y síntesis de documentos científicos con tecnología RAG</b>
</p>

## 📸 Capturas de pantalla

### Análisis y procesamiento de documentos

![Inteligencia sobre artículo: Consulta contextual precisa sobre PDFs científicos](img/inteligencia-articulo.png)
*Inteligencia sobre artículo: Consulta contextual precisa sobre PDFs científicos*

![Revisión de artículo científico: Generación de revisiones completas a partir de múltiples PDFs](img/revision-articulo-cientifico.png)
*Revisión de artículo científico: Generación de revisiones completas a partir de múltiples PDFs*

![Resumen estructurado de documentos científicos](img/resumen-estructurado.png)
*Resumen estructurado con organización académica y referencias*

### Gestión de usuarios y sistema

![Panel de administración de usuarios](img/panel-usuarios.png)
*Panel de administración con gestión completa de usuarios*

![Edición de usuarios y configuración de permisos](img/edicion -usuarios.png)
*Interfaz de edición de usuarios y configuración de permisos*

![Monitorización de actividad de usuarios](img/actividad-usuarios.png)
*Seguimiento detallado de la actividad de usuarios en la plataforma*

![Historial de consultas y análisis](img/historial.png)
*Historial completo de consultas y análisis realizados*

![Configuración de API Keys](img/apikeys.png)
*Interfaz para la configuración y validación de API Keys*

---

## 🔥 Características principales

- 🔑 **Configuración sencilla de API Keys**
  - Interfaz gráfica para configurar tus claves API de OpenAI y Anthropic.
  - Validación en tiempo real de las claves ingresadas.
  - Indicador visual del estado de configuración.
  - Instrucciones paso a paso para obtener las claves.

- 📚 **Gestión avanzada de PDFs con almacenamiento en la nube**
  - Carga rápida y sencilla de documentos PDF con almacenamiento en AWS S3.
  - Sistema de cuotas de almacenamiento personalizable (200 MB por usuario por defecto).
  - Visualización de documentos subidos con indicador de espacio utilizado/disponible.
  - Selección individual o múltiple para análisis específico.
  - Botón para eliminación masiva de PDFs y gestión eficiente del espacio.

- 🔍 **Inteligencia sobre artículo**
  - Consultas contextuales precisas sobre el contenido de los PDF.
  - Ejemplos pre-configurados para análisis de variables, metodologías, resultados y síntesis.
  - Respuestas referenciadas directamente a las fuentes originales.

- 📝 **Generación de resúmenes estructurados**
  - Organización clara según normas académicas con 10+ secciones detalladas.
  - Títulos adaptados a normas RAE y tablas de variables bien estructuradas.
  - Referencias APA completas con información de recuperación.
  - Soporte multilenguaje: Español, Inglés, Francés, Alemán, Italiano, Portugués.

- 📄 **Artículo de revisión científica** (Beta)
  - Generación de artículos de revisión completos a partir de múltiples resúmenes PDFs.
  - Estructura académica con secciones personalizables a través de instrucciones específicas.
  - Síntesis coherente de información de múltiples fuentes con referencias cruzadas.

- 📊 **Análisis de uso y costes**
  - Contador en tiempo real de PDFs procesados por sesión.
  - Seguimiento en vivo del consumo total de tokens.
  - Cálculo automático de costes basado en modelo seleccionado.
  - Gráficos interactivos de uso por modelo y distribución de tokens.
  - Panel de administración detallado con estadísticas completas.

- 👥 **Panel de (U)Boost avanzado** (Actualizado)
  - Gestión completa de usuarios con estados: pendiente, aprobado, pausado, eliminado.
  - Configuración personalizada de límites de almacenamiento por usuario (predeterminado: 200 MB).
  - Visualización detallada del espacio utilizado y disponible por cada usuario.
  - Estadísticas detalladas de uso con desglose por modelo y usuario.
  - Gráficos interactivos para visualización de consumo, costes y espacio de almacenamiento.
  - Seguimiento de actividad de usuarios en tiempo real con alertas de límites de almacenamiento.
  - Recálculo y verificación de costes de tokens y espacio de almacenamiento bajo demanda.

- 📈 **Monitorización de actividad de usuarios** (Nuevo)
  - Registro detallado de inicios de sesión y acciones realizadas.
  - Seguimiento de sesiones con duración y acciones.
  - Métricas de uso: PDFs procesados, tokens consumidos por modelo.
  - Informes de actividad con filtrado por usuario y período.
  - Detección de patrones de uso y análisis de tendencias.

- 📧 **Sistema de notificaciones por correo electrónico** (Nuevo)
  - Emails de bienvenida al registrarse en la plataforma.
  - Notificaciones de inicio de sesión con detalles de seguridad (IP, ubicación, dispositivo).
  - Alertas cuando un administrador aprueba la cuenta de usuario.
  - Sistema de recuperación de contraseña con tokens seguros.
  - Plantillas responsive con branding consistente de UBoost.

- 🔎 **Sistema de gestión de datos con MongoDB** (Mejorado)
  - Almacenamiento eficiente de perfiles de usuario con estados y roles.
  - Registro detallado de actividad con seguimiento temporal.
  - Historial de consultas con acceso rápido y optimizado.
  - Estadísticas de uso con agregaciones para análisis de rendimiento.
  - Indexación avanzada para búsquedas y filtrado de alta velocidad.

- ⚙️ **Opciones avanzadas de IA**
  - **Tokens máximos:** Controla la longitud máxima del contenido generado.
  - **Temperatura:** Ajusta la creatividad de las respuestas (0.7 recomendado).
  - **Top P:** Diversidad léxica (0.9-1 recomendado).
  - **Penalización frecuencia:** Evita repetición de frases.
  - **Penalización presencia:** Evita repetición de temas.

- 💾 **Opciones de exportación y gestión del historial**
  - Descarga en formato Markdown (.md) y texto plano (.txt).
  - Copia rápida directa al portapapeles.
  - Historial completo de consultas realizadas con indicadores visuales.
  - Exportación de múltiples consultas seleccionadas en archivo ZIP.
  - Reutilización de consultas anteriores con un solo clic.

- 🎨 **Interfaz moderna y amigable**
  - Diseño intuitivo y responsive con Material-UI.
  - Asistentes contextuales con ejemplos copiables para cada función.
  - Feedback visual durante cargas y generación de contenido.

---

## 🎛️ Parámetros avanzados de IA

| Parámetro | Descripción | Valores recomendados |
|-----------|-------------|----------------------|
| **Tokens máximos** | Longitud máxima del texto generado | 8192 (GPT-4o), 4096 (GPT-4o-mini) |
| **Temperatura** | Creatividad/Aleatoriedad de respuestas | 0 (bajo), 0.7 (medio, recomendado), 2 (alto) |
| **Top P** | Diversidad léxica en generación | 0.9-1 |
| **Penalización frecuencia** | Evitar repetición de frases | 0 a 2 |
| **Penalización presencia** | Evitar repetición temática | 0 a 2 |

> **Nota:** Experimenta según el tipo y objetivo del análisis.

---

## 📊 Cálculo de costes de tokens (Nuevo)

El sistema implementa un cálculo preciso de costes basado en los modelos utilizados:

| Modelo | Coste por millón de tokens (entrada) | Coste por millón de tokens (salida) |
|--------|--------------------------------------|-------------------------------------|
| GPT-4o | $2.50 | $1.25 |
| GPT-4o-mini | $0.15 | $0.075 |
| Claude Sonnet 3.7 | $3.00 | $15.00 |

El Panel de (U)Boost incluye:
- Cálculo automático de costes por sesión y acumulados
- Herramienta de recálculo para verificar y corregir estadísticas
- Gráficos de distribución de costes por modelo y tipo de token
- Exportación de informes detallados para facturación

## 📝 Gestión de almacenamiento con AWS S3 (Nuevo)

UBoost incorpora un sistema avanzado de almacenamiento en la nube para gestionar eficientemente los archivos PDF de los usuarios:

### ☁️ Arquitectura de almacenamiento

- **Almacenamiento primario:** AWS S3 para alta disponibilidad y escalabilidad.
- **Almacenamiento de respaldo:** Sistema de archivos local como fallback.
- **Política de acceso:** Acceso controlado mediante permisos de usuario y claves presignadas.
- **Estructura:** Buckets organizados por tipo de contenido y usuario para optimizar el acceso.

### 💳 Sistema de límites de almacenamiento

- **Cuota predeterminada:** 200 MB de almacenamiento por usuario.
- **Cuotas personalizables:** Administradores pueden ajustar límites por usuario según necesidades.
- **Monitoreo visual:** Indicador de espacio utilizado/disponible en la interfaz de usuario.
- **Alertas automáticas:** Notificaciones cuando el usuario se acerca al límite (80%, 90%, 95%).
- **Gestión de espacio:** Herramientas para liberar espacio con eliminación selectiva o masiva.

### 📊 Panel de administración de almacenamiento

| Funcionalidad | Descripción |
|--------------|-------------|
| **Visualización de cuotas** | Gráficos de barras mostrando uso vs. límite por usuario |
| **Ajuste de límites** | Interfaz para aumentar/disminuir cuotas individuales |
| **Estadísticas globales** | Uso total del sistema y distribución por usuario |
| **Alertas de sistema** | Notificaciones de almacenamiento casi lleno a nivel global |
| **Limpieza automática** | Configuración de políticas de retención por inactividad |

### 🔐 Seguridad y cumplimiento

- Cifrado AES-256 para todos los archivos en reposo.
- Transferencia segura mediante HTTPS.
- Política de retención configurable para cumplimiento normativo.
- Registro detallado de todas las operaciones para auditoría.

## 🔎 Arquitectura de MongoDB en UBoost

UBoost utiliza MongoDB Atlas como base de datos principal, aprovechando su flexibilidad y escalabilidad para estructurar la información del sistema:

### Colecciones principales

| Colección | Descripción | Campos clave |
|------------|-------------|---------------|
| **Users** | Perfiles de usuario y credenciales | `email`, `password` (hash), `status`, `role`, `firstName`, `lastName`, `country`, `city`, `tokensConsumed`, `pdfsProcessed`, `storage` (`limitMB`, `usedBytes`) |
| **UserActivity** | Registro de acciones de usuarios | `userId`, `action`, `timestamp`, `ipAddress`, `details`, `userAgent` |
| **QueryHistory** | Historial de consultas realizadas | `userId`, `query`, `response`, `timestamp`, `model`, `tokensUsed`, `pdfs` |
| **Uploads** | Metadatos de archivos PDF subidos | `userId`, `originalName`, `storagePath`, `size`, `uploadDate`, `processed` |

### Ciclo de vida de datos

#### Gestión de usuarios
1. **Registro**: Nuevo documento en `Users` con estado `pending`
2. **Aprobación**: Actualiza estado a `approved` en `Users` y envía notificación por email
3. **Actividad**: Cada inicio de sesión genera un documento en `UserActivity` con detalles de seguridad
4. **Métricas**: Actualizaciones incrementales de `tokensConsumed` y `pdfsProcessed` tras cada operación

#### Procesamiento de consultas
1. **Subida PDF**: Genera documento en `Uploads` con metadatos del archivo
2. **Consulta**: Crea documento en `QueryHistory` con tokens consumidos y modelo usado
3. **Estadísticas**: Agregaciones en tiempo real para paneles de administración

### Optimizaciones de rendimiento
- Índices compuestos para búsquedas frecuentes (usuario + fecha)
- Time-To-Live (TTL) para documentos temporales
- Indexación de texto completo para búsqueda en historial de consultas
- Replicación para alta disponibilidad en MongoDB Atlas

---

## 💻 Arquitectura tecnológica

### Frontend 🖥️
- React 18
- Material-UI
- Axios (Cliente HTTP)
- ReactMarkdown (remark-gfm, tablas Markdown)
- Recharts (Visualización de datos y gráficos interactivos)

### Backend ⚙️
- Node.js (18+) y Express
- MongoDB Atlas (Almacenamiento y gestión de datos)
- AWS S3 (Almacenamiento de PDFs en la nube)
- OpenAI API (GPT-4o, GPT-4o-mini)
- Anthropic API (Claude 3.7 Sonnet)
- Resend API (Sistema de notificaciones por email)
- Multer (middleware subida PDFs)
- PDF.js (procesamiento PDFs)
- Bcrypt (Encriptación de contraseñas)
- JWT (Autenticación basada en tokens)
- AWS SDK (Integración con S3 para almacenamiento)

---

## 🚀 Instalación y ejecución

### 🔧 Requisitos previos
- Node.js v18+ (recomendado v18.17.0 o superior)
- npm v9+ o yarn v1.22+
- Git instalado
- MongoDB instalado o cuenta en MongoDB Atlas
- Claves API de OpenAI y Anthropic (opcionales para la instalación inicial)

### 📥 Instalación paso a paso

#### 1. Clonar el repositorio
```bash
git clone https://github.com/686f6c61/abstract-scientific-paper.git
cd abstract-scientific-paper
```

#### 2. Instalar dependencias del servidor
```bash
cd server
npm install
cd ..
```

#### 3. Instalar dependencias del cliente
```bash
cd client
npm install
cd ..
```

#### 4. Configurar variables de entorno
Crea un archivo `.env` en la carpeta raíz del proyecto basado en el archivo `.env.example`:

```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita el archivo con tu editor favorito
nano .env   # o usa: vim .env, code .env, etc.
```

Modifica el archivo `.env` con tus claves API y configuraciones:
```env
# Claves de API para modelos de IA
OPENAI_API_KEY=sk-...            # Tu clave de OpenAI
ANTHROPIC_API_KEY=sk-ant-...     # Tu clave de Anthropic

# Configuración de MongoDB
MONGO_URI=mongodb+srv://...       # Tu conexión a MongoDB

# Configuración de JWT para autenticación
JWT_SECRET=tu_clave_secreta_jwt  # Clave para firmar tokens JWT
JWT_EXPIRE=30d                   # Tiempo de expiración de tokens (30 días)

# Configuración de correo electrónico (Resend)
RESEND_API_KEY=re_...             # Tu clave API de Resend
EMAIL_FROM=no-reply@xxx.es    # Dirección de correo predeterminada
SECURITY_EMAIL=security@xxx.es # Dirección para alertas de seguridad

# Configuración del entorno

A continuación se detalla la estructura completa del archivo `.env` que deberás configurar para el funcionamiento correcto de la aplicación:

```plaintext
# API Keys
ANTHROPIC_API_KEY=tu_clave_api_de_anthropic_aqui      # Clave para Claude 3.7 Sonnet
OPENAI_API_KEY=tu_clave_api_de_openai_aqui            # Clave para GPT-4o y GPT-4o-mini

# Server Configuration
PORT=5000                        # Puerto del servidor
NODE_ENV=development             # Entorno (development/production)

# MongoDB Configuration
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=tu_clave_secreta_jwt_aqui     # Clave secreta para JWT
JWT_EXPIRE=30d                           # Tiempo de expiración del token JWT
JWT_COOKIE_EXPIRE=30                     # Tiempo de expiración de la cookie JWT

# AWS S3 Configuration
AWS_S3_BUCKET_NAME=nombre-de-tu-bucket-s3    # Nombre del bucket S3
AWS_ACCESS_KEY_ID=tu_access_key_id_aqui      # ID de clave de acceso AWS
AWS_SECRET_ACCESS_KEY=tu_secret_key_aqui     # Clave secreta de AWS
AWS_REGION=eu-west-1                         # Región de AWS (por defecto: eu-west-1)
```

> **Nota**: No es obligatorio configurar las API Keys de OpenAI y Anthropic en este paso. También puedes configurarlas más tarde directamente desde la interfaz gráfica de la aplicación usando el botón de configuración (🔑) en la barra superior. Sin embargo, el resto de variables son necesarias para el funcionamiento correcto del sistema.

### 🔑 Obtención de API Keys

#### Resend API Key (para notificaciones por email)
1. Crea una cuenta en [Resend](https://resend.com/signup)
2. Accede a tu [Dashboard](https://resend.com/dashboard)
3. Ve a la sección API Keys y crea una nueva clave
4. Copia la clave generada y añádela a tu archivo .env
5. Para producción, verifica el dominio `uboost.es` en la sección "Domains"

#### OpenAI API Key (para GPT-4o y GPT-4o-mini)
1. Crea una cuenta en [OpenAI Platform](https://platform.openai.com/signup)
2. Ve a la sección de [API Keys](https://platform.openai.com/api-keys)
3. Haz clic en "Create new API key"
4. Asigna un nombre descriptivo a tu clave (ej. "UBoostApp")
5. Copia la API key generada (comienza con "sk-")
6. Guárdala en un lugar seguro, ¡no podrás volver a verla!

#### Anthropic API Key (para Claude 3.7 Sonnet)
1. Crea una cuenta en [Anthropic Console](https://console.anthropic.com/signup)
2. Ve a la sección de [API Keys](https://console.anthropic.com/account/keys)
3. Haz clic en "Create key"
4. Asigna un nombre descriptivo y establece los permisos
5. Copia la API key generada (comienza con "sk-ant-")
6. Guárdala en un lugar seguro, ¡no podrás volver a verla!

### ▶️ Ejecución de la aplicación

#### Iniciar en modo desarrollo (dos terminales)

**Terminal 1 - Servidor Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Cliente Frontend:**
```bash
cd client
npm start
```

#### Iniciar con un solo comando (producción)
```bash
# En la carpeta raíz del proyecto
npm start
```

### 🌐 Acceso a la aplicación
- Frontend React: [http://localhost:3000](http://localhost:3000)
- Backend Express: [http://localhost:5100](http://localhost:5100)
- Panel de (U)Boost: [http://localhost:3000/admin](http://localhost:3000/admin)

### ⚙️ Configuración del servidor

**IMPORTANTE**: La aplicación está configurada con los siguientes parámetros en los archivos `.env`:

```
# Server Configuration
PORT=5100
NODE_ENV=development
```

Es crucial mantener esta configuración para evitar conflictos con otras aplicaciones en macOS (especialmente Control Center que puede usar el puerto 5000).

### 🔍 Verificar la instalación
Para comprobar que todo está funcionando correctamente:

1. Abre [http://localhost:3000](http://localhost:3000) en tu navegador
2. Asegúrate de que la interfaz se carga correctamente
3. Configura tus API Keys usando el botón de configuración en la barra superior
4. Sube un PDF de prueba para verificar la funcionalidad

### ❓ Solución de problemas comunes

- **Error: ENOENT no such file or directory**: Asegúrate de que la estructura de carpetas sea correcta y estés ejecutando los comandos desde la ubicación adecuada.
- **Error de conexión al servidor**: Verifica que el servidor backend esté ejecutándose en el puerto 5100.
- **Problemas con las API Keys**: Comprueba que las claves están correctamente formateadas y son válidas.
- **Error de conexión a MongoDB**: Verifica la cadena de conexión en el archivo .env.

---

## 📜 Gestión del historial de consultas

El sistema implementa un historial completo de consultas y resúmenes con múltiples funcionalidades:

- **Guardado automático**: Todas las consultas y resúmenes se guardan automáticamente.
- **Visualización detallada**: Diferenciación visual entre consultas simples y resúmenes estructurados.
- **Selección múltiple**: Posibilidad de seleccionar varias consultas para operaciones por lotes.
- **Exportación ZIP**: Las consultas seleccionadas pueden exportarse como archivo ZIP con cada consulta en formato TXT.
- **Operaciones de consulta**:
  - Copia al portapapeles
  - Descarga individual
  - Preguntas de seguimiento basadas en respuestas anteriores
  - Reutilización de consultas previas
- **Persistencia**: El historial se mantiene entre sesiones mediante almacenamiento local.

---

## 📂 Estructura del proyecto

```
📁 abstract-scientific-paper
├── 📁 client                      # Frontend React
│   ├── 📁 public                # Archivos públicos y estáticos
│   │   └── 📁 icons            # Iconos de la aplicación
│   │
│   └── 📁 src                   # Código fuente React
│       ├── 📁 components        # Componentes UI
│       │   ├── 📁 Admin         # Panel de administración (nuevo)
│       │   └── 📁 ReviewArticle  # Componentes de artículo de revisión
│       ├── 📁 contexts          # Contextos (API Keys, PDF, etc.)
│       ├── 📁 services          # Servicios para comunicación con API
│       ├── 📁 utils             # Utilidades y funciones auxiliares
│       └── 📁 workers           # Web workers para procesamiento
│
├── 📁 server                      # Backend Node.js/Express
│   ├── 📁 controllers        # Controladores de rutas API
│   ├── 📁 middleware         # Middleware de autenticación y autorización
│   ├── 📁 models             # Modelos de datos MongoDB
│   ├── 📁 routes             # Definición de rutas API
│   ├── 📁 uploads            # Almacenamiento temporal de PDFs
│   └── 📁 utils              # Utilidades para proceso RAG y IA
│
├── 📁 examples                    # Ejemplos de resultados generados
└── 📁 img                         # Imágenes para documentación
```

### Componentes principales

#### Componentes de infraestructura
- **Header**: Barra superior con navegación, gestión de API Keys y historial de versiones (V.01-V.1.3)
- **ApiKeysConfig**: Interfaz mejorada para configuración y validación de claves API de OpenAI y Anthropic
- **VersionHistory**: Historial completo de versiones con detalles de cada actualización
- **PdfContext**: Contexto React para gestión centralizada de PDFs, consultas e historial
- **MainContent**: Contenedor principal con sistema de pestañas para las diferentes funcionalidades

#### Panel de (U)Boost (Nuevo)
- **UserManagement**: Gestión completa de usuarios con estados y acciones
- **ApiKeyManagement**: Gestión centralizada de claves API
- **UsageStats**: Panel de estadísticas con gráficos interactivos 
- **UserActivity**: Seguimiento detallado de la actividad de los usuarios

#### Consulta contextual ("INTELIGENCIA SOBRE ARTÍCULO")
- **QueryForm**: Formulario principal para consultas contextuales sobre PDFs
- **QueryInput**: Campo de consulta con sugerencias y autocompletado
- **QueryExamples**: Ejemplos preconfigurados para consultas comunes
- **FileUpload**: Componente para subida individual y múltiple de PDFs
- **PdfList**: Visualización y gestión de documentos cargados
- **ResultsDisplay**: Visualización de resultados con formato Markdown

#### Artículo de revisión científica
- **ReviewArticleForm**: Interfaz mejorada para generación de artículos de revisión con etiqueta "Beta"
- **SpecificInstructions**: Campo de texto libre para instrucciones detalladas de generación
- **ModelSelector**: Selector de modelos con diálogo informativo sobre cada modelo disponible
- **AdvancedOptions**: Panel rediseñado con controles para temperatura, tokens y otros parámetros
- **StepIndicator**: Indicador visual del proceso de generación
- **LanguageSelector**: Selección ampliada de idiomas (Español, Inglés, Francés, Alemán, Italiano, Portugués)

#### Historial y exportación
- **QueryHistory**: Registro completo del historial de consultas realizadas
- **QueryHistoryFixed**: Panel de historial persistente con funcionalidad de exportación
- **ExportOptions**: Opciones de descarga en formato Markdown, texto y ZIP

---

## 🧠 Implementación avanzada RAG (Retrieval Augmented Generation)

- Basado en [OpenAI Cookbook](https://cookbook.openai.com/examples/file_search_responses).
- Extracción eficiente de contenido PDF mediante embeddings optimizados.
- Búsqueda paralela mejorada para grandes colecciones.
- Generación de resúmenes con referencias bibliográficas precisas.
- Reconocimiento específico de estructura académica y elementos visuales (tablas, figuras).

---

## 📋 Limitaciones del sistema

- Optimizado principalmente para documentos académicos en texto.
- Documentos con ecuaciones complejas, muchas tablas o gráficos visuales pueden no procesarse de forma óptima.
- Documentos extremadamente largos o complejos pueden afectar al rendimiento y coste.

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Sigue estos pasos para contribuir:

1. Haz un fork del repositorio.
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza los cambios y commits (`git commit -m "añade nueva funcionalidad"`).
4. Envía la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request en GitHub.

---

## 📜 Licencia

Este proyecto está disponible bajo Licencia MIT. Ver [`LICENSE`](LICENSE) para detalles.

---

## 📋 Ejemplos de resúmenes generados

### Ejemplos de contenido generado

- [**Resumen generado con GPT-4o-mini**](examples/sample-abstract-4o-mini.md) - La importancia de la representación de personas con discapacidad para abordar el sesgo implícito en el lugar de trabajo

- [**Artículo de revisión generado con Claude 3.7 Sonnet**](examples/sample-review-claude-sonnet-37.md) - La importancia del capital psicológico en la relación entre orientación religiosa y estrés laboral

## 📧 Contacto y soporte

Si tienes dudas o sugerencias, abre un issue en este repositorio. ¡Responderemos con gusto!

---

<p align="center">
Desarrollado con ❤️ para el análisis avanzado de documentos científicos<br>
(U)Boost scientific paper - Marzo 2025
</p>
