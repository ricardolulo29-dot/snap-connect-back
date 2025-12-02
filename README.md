# SnapConnect Backend

API REST para SnapConnect, una red social de fotografía donde los usuarios pueden compartir imágenes, seguir a otros usuarios, dar likes, comentar y chatear.

## 🚀 Características

- ✅ Autenticación y autorización con JWT
- 📸 Publicación de posts con imágenes (base64)
- 👥 Sistema de seguidores/seguidos
- ❤️ Likes en posts
- 💬 Comentarios en posts
- 💌 Sistema de mensajería privada (chats)
- 🔍 Búsqueda de usuarios
- 👤 Perfiles de usuario con estadísticas

## 🛠️ Tecnologías

- **Node.js** + **Express** - Framework backend
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación
- **Bcrypt** - Hash de contraseñas
- **Joi** - Validación de datos
- **ESLint** + **Prettier** - Code quality

## 🏗️ Arquitectura

El proyecto sigue una arquitectura en capas con programación orientada a objetos:

- **Models**: Entidades de dominio (User, Post, Comment, Chat, Message)
- **Repositories**: Acceso a datos y queries SQL
- **Services**: Lógica de negocio
- **Controllers**: Manejo de peticiones HTTP
- **Middlewares**: Autenticación, validación y manejo de errores

### Patrones implementados:

- **Repository Pattern** - Abstracción de acceso a datos
- **Service Layer Pattern** - Lógica de negocio centralizada
- **Dependency Injection** - Inyección de dependencias en constructores
- **Factory Pattern** - Métodos `fromDatabase()` en modelos
- **Custom Error Handling** - Errores HTTP específicos (404, 401, 403, etc.)

### Tablas principales:

- **users**: Usuarios de la aplicación
- **posts**: Publicaciones de fotos
- **comments**: Comentarios en posts
- **likes**: Likes en posts (many-to-many)
- **user_follows_user**: Relación de seguimiento (many-to-many)
- **chats**: Conversaciones entre usuarios
- **messages**: Mensajes dentro de los chats

## 📋 Requisitos previos

### Software necesario:

1. **Node.js** (v18 o superior)
   - 🪟 Windows: [Descargar desde nodejs.org](https://nodejs.org/en/download/)
   - 🐧 Linux:

     ```bash
     # Ubuntu/Debian
     curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
     sudo apt-get install -y nodejs

     # Fedora
     sudo dnf install nodejs
     ```

   - 🍎 macOS:
     ```bash
     # Con Homebrew
     brew install node
     ```
     O descargar desde [nodejs.org](https://nodejs.org/en/download/)

2. **PostgreSQL** (v14 o superior)
   - 🪟 Windows: [Descargar instalador](https://www.postgresql.org/download/windows/)
   - 🐧 Linux:

     ```bash
     # Ubuntu/Debian
     sudo apt update
     sudo apt install postgresql postgresql-contrib

     # Fedora
     sudo dnf install postgresql-server postgresql-contrib
     sudo postgresql-setup --initdb
     sudo systemctl start postgresql
     ```

   - 🍎 macOS:
     ```bash
     # Con Homebrew
     brew install postgresql@14
     brew services start postgresql@14
     ```
     O descargar desde [postgresql.org](https://www.postgresql.org/download/macosx/)

3. **npm** (incluido con Node.js) o **yarn**

### Verificar instalaciones:

```bash
node --version   # Debe mostrar v18.x.x o superior
npm --version    # Debe mostrar 9.x.x o superior
psql --version   # Debe mostrar 14.x o superior
```

## ⚙️ Configuración

1. **Instalar dependencias**

```bash
npm install
```

2. **Configurar variables de entorno**

Crea un archivo `.env` en la raíz del proyecto:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=SnapConnect
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
JWT_SECRET=tu_secreto_jwt
```

3. **Ejecutar migraciones**

```bash
npm run migrations
```

4. **(Opcional) Cargar datos de prueba**

```bash
npm run seeds
```

## 🚀 Ejecución

### Desarrollo

```bash
npm run dev
```

### Linting

```bash
npm run lint
npm run lint:fix
```

## 📡 Endpoints de la API

### 🔐 Autenticación (`/auth`)

- `POST /auth/signup` - Registrar nuevo usuario
- `POST /auth/login` - Iniciar sesión

### 👤 Usuarios (`/users`)

- `GET /users/:id/profile` - Obtener perfil de usuario
- `GET /users/:id/followers` - Obtener seguidores
- `GET /users/:id/following` - Obtener seguidos
- `POST /users/:id/follow` - Seguir usuario
- `DELETE /users/:id/unfollow` - Dejar de seguir
- `GET /users/search?query=` - Buscar usuarios
- `POST /users/:id/image` - Actualizar foto de perfil

### 📸 Posts (`/posts`)

- `GET /posts` - Obtener feed de posts (propios + seguidos)
- `POST /posts` - Crear nuevo post
- `DELETE /posts/:id` - Eliminar post
- `PATCH /posts/:id` - Editar contenido de post
- `POST /posts/:id/like` - Dar like a un post
- `POST /posts/:id/unlike` - Quitar like
- `GET /posts/:id/comments` - Obtener comentarios
- `POST /posts/:id/comments` - Crear comentario
- `DELETE /posts/:postId/comments/:commentId` - Eliminar comentario

### 💬 Chats (`/chats`)

- `GET /chats` - Obtener lista de chats del usuario
- `POST /chats` - Crear nuevo chat
- `GET /chats/:chatId/messages` - Obtener mensajes de un chat
- `POST /chats/:chatId/messages` - Enviar mensaje
- `PATCH /chats/:chatId/read` - Marcar mensajes como leídos

## 📁 Estructura del Proyecto

```
SnapConnect-back/
├── database/
│   ├── migrations/        # Migraciones SQL
│   ├── seeds/            # Datos de prueba
│   ├── pool.js           # Configuración PostgreSQL
│   └── run-migrations.js
├── src/
│   ├── api/
│   │   ├── auth/         # Autenticación (Service, Controller, Routes)
│   │   ├── users/        # Usuarios (Service, Controller, Routes)
│   │   ├── posts/        # Posts (Service, Controller, Routes)
│   │   └── chats/        # Mensajería (Service, Controller, Routes)
│   ├── config/           # Configuración y DI container
│   │   └── dependencies.js
│   ├── errors/           # Errores personalizados
│   │   └── AppError.js
│   ├── middlewares/      # Middlewares globales
│   │   ├── auth.middleware.js
│   │   ├── validation.middleware.js
│   │   └── error.middleware.js
│   ├── models/           # Entidades de dominio (OOP)
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Comment.js
│   │   ├── Chat.js
│   │   └── Message.js
│   ├── repositories/     # Acceso a datos (OOP)
│   │   ├── users.repository.js
│   │   ├── posts.repository.js
│   │   ├── comments.repository.js
│   │   ├── likes.repository.js
│   │   └── chats.repository.js
│   ├── mappers/          # Transformación snake_case ↔ camelCase
│   ├── utils/            # Utilidades (asyncHandler)
│   ├── app.js            # Configuración Express
│   └── index.js          # Punto de entrada
├── docs/                 # Documentación
│   └── class-diagram.md  # Diagrama de clases UML
├── .env                  # Variables de entorno
├── eslint.config.js      # Configuración ESLint
└── package.json
```

## 🔒 Autenticación

Todos los endpoints (excepto `/auth/signup` y `/auth/login`) requieren un token JWT en el header:

```
Authorization: Bearer <token>
```

### Códigos de respuesta HTTP:

- `200 OK` - Operación exitosa
- `201 Created` - Recurso creado exitosamente
- `400 Bad Request` - Error de validación
- `401 Unauthorized` - Token inválido, expirado o credenciales incorrectas
- `403 Forbidden` - Sin permisos para realizar la acción
- `404 Not Found` - Recurso no encontrado
- `409 Conflict` - El recurso ya existe (ej: usuario duplicado)
- `500 Internal Server Error` - Error interno del servidor

## 👩‍💻 Autor
