# news-explorer-backend

API REST del proyecto final **NewsExplorer** de TripleTen. Se encarga de la autenticación de usuarios y del almacenamiento de los artículos de noticias que cada usuario guarda en su cuenta.

## La API en línea

### → https://api.news.around-daniel.lat

Responde a las rutas documentadas abajo. Una petición sin token devuelve `401` con `{ "message": "Authorization required" }`, que es la forma rápida de comprobar que está viva.

El front-end que la consume vive en [news.around-daniel.lat](https://news.around-daniel.lat), en el repositorio [news-explorer-frontend](https://github.com/DanielPzCz/news-explorer-frontend).

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

## Despliegue

La API corre con **pm2** en un servidor de Vultr, detrás de **nginx** como proxy inverso, y guarda los datos en **MongoDB Atlas**.

Todos estos comandos se ejecutan en el servidor.

```bash
# 1. Traer el código e instalar solo lo necesario para producción.
git clone https://github.com/DanielPzCz/news-explorer-backend.git
cd news-explorer-backend
npm install --omit=dev
```

`--omit=dev` salta ESLint y nodemon, que en producción no se usan.

```bash
# 2. Crear el archivo .env, que vive solo en el servidor.
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
nano .env
```

```
NODE_ENV=production
JWT_SECRET=la_clave_que_generó_el_comando_anterior
DB_URL=mongodb+srv://usuario:contraseña@cluster.mongodb.net/newsexplorerdb?retryWrites=true&w=majority
PORT=3001
```

El puerto se elige con `PORT`; si la variable no existe, la aplicación usa el 3000. En este despliegue escucha en el **3001**, porque el servidor aloja otra aplicación en el 3000. Si cambias el puerto, ajústalo también en `deploy/nginx.conf`, donde el proxy apunta a él.

```bash
# 3. Levantar el proceso y hacer que sobreviva a los reinicios.
pm2 start app.js --name news-explorer-api
pm2 save
pm2 startup     # imprime un comando con sudo: hay que ejecutarlo
```

```bash
# 4. Publicar la API en el dominio.
sudo cp deploy/nginx.conf /etc/nginx/sites-available/news-explorer-api
sudo ln -s /etc/nginx/sites-available/news-explorer-api /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d api.news.around-daniel.lat   # tu dominio
```

El archivo [`deploy/nginx.conf`](deploy/nginx.conf) no sirve archivos: recibe cada petición y se la entrega al proceso de Node en el puerto 3001. Eso es un proxy inverso, y es lo que permite que la API se vea en el 443 con HTTPS mientras Node escucha en un puerto interno sin privilegios.

Para actualizarla después de un cambio:

```bash
git pull && npm install --omit=dev && pm2 restart news-explorer-api
```

### Base de datos

Los datos viven en un cluster de **MongoDB Atlas**, en la base `newsexplorerdb`. La cadena de conexión completa —con usuario y contraseña— va en el `.env` y nunca en el repositorio. La IP del servidor debe estar autorizada en la lista de acceso de Atlas para que la conexión funcione.

En desarrollo no hace falta configurar nada: si no existe `DB_URL`, la aplicación usa una instancia local en `mongodb://localhost:27017/newsexplorerdb`.

## Cómo ejecutarlo en local

```bash
npm install

npm run dev    # modo de desarrollo con hot reload
npm run start  # modo de producción
```

Se necesita una instancia local de MongoDB (`mongodb://localhost:27017/newsexplorerdb`). En producción, las variables `NODE_ENV`, `JWT_SECRET`, `PORT` y `DB_URL` se definen en un archivo `.env` en el servidor (ver `.env.example`).
