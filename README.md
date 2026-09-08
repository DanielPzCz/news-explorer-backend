# news-explorer-backend

API REST del proyecto final **NewsExplorer** de TripleTen. Se encarga de la autenticación de usuarios y del almacenamiento de los artículos de noticias que cada usuario guarda en su cuenta.

## Rutas

| Método | Ruta                   | Protegida | Respuesta                                                        |
| ------ | ---------------------- | --------- | ---------------------------------------------------------------- |
| POST   | `/signup`              | No        | Crea un usuario con `email`, `password` y `name`.                |
| POST   | `/signin`              | No        | Comprueba las credenciales y devuelve un JWT.                    |
| GET    | `/users/me`            | Sí        | Información del usuario conectado (`email` y `name`).            |
| GET    | `/articles`            | Sí        | Todos los artículos guardados por el usuario.                    |
| POST   | `/articles`            | Sí        | Crea un artículo con `keyword`, `title`, `text`, `date`, `source`, `link` e `image`. |
| DELETE | `/articles/:articleId` | Sí        | Elimina un artículo guardado por su `_id`.                       |

Las rutas protegidas requieren el encabezado `Authorization: Bearer <token>`. Un usuario solo puede ver y borrar sus propios artículos.

### Manejo de errores

- **400** cuando los datos del cuerpo o los parámetros no pasan la validación.
- **401** cuando el token falta, es inválido, o las credenciales son incorrectas.
- **403** cuando se intenta borrar un artículo de otro usuario.
- **404** cuando el recurso o la ruta no existen.
- **409** cuando el correo ya está registrado.
- **500** ante un error del servidor.

Las respuestas de error contienen únicamente el campo `message`.

## Tecnologías y técnicas utilizadas

- **Node.js** y **Express** para el servidor y el enrutamiento.
- **MongoDB** con **Mongoose** para los esquemas `user` y `article`.
- **JWT** (`jsonwebtoken`) para la autorización; el token expira en 7 días.
- **bcryptjs** para almacenar las contraseñas con hash.
- **celebrate/Joi + validator** para validar las solicitudes antes de llegar a los controladores.
- **winston + express-winston** para los registros `request.log` y `error.log` en formato JSON.
- Manejo de errores centralizado con clases de error personalizadas.
- **ESLint** (guía de estilo Airbnb) + **Prettier** + **EditorConfig**.

## Cómo ejecutarlo en local

```bash
npm install

npm run dev    # modo de desarrollo con hot reload
npm run start  # modo de producción
```

Se necesita una instancia local de MongoDB (`mongodb://localhost:27017/newsexplorerdb`). En producción, las variables `NODE_ENV`, `JWT_SECRET`, `PORT` y `DB_URL` se definen en un archivo `.env` en el servidor (ver `.env.example`).
