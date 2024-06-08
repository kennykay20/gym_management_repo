
## Description

A Gym Management REST-API built with Nestjs framework, Typescript and typeorm. 
TypeOrm: is one of the most mature Object Relational Mapper (ORM) available for TypeScript. Since it's written in TypeScript, it integrates well with the Nest framework.
Data Persistence: Postgres Database.

## Steps on how i implemented and made this app
1. Create a Gym Rest API with a crud pattern, with nest JS cli
   inside the src(source folder) it contains different kinds of folders
   e.g gym folder contains the gym controller, service and module e.t.c

2. The user folder - contains a user controller, service, module, models and dto folder, the controller handles the router to register a user once a user is registered he or she can now access to login cos without authenticate login u cannot create a task, nor read a task.
  the task models contains the properties for the task table, inside it contains a ManyToOne property decorator for User, which means a single user can create as many task, TaskStatus property which is set as 'OPEN' by default. 

  `note`: All task are saved into the table with a column name isDeleted and set as false by default, but when you delete a task by an id the column will be set to true, cos i am not deleting all the files for record purpose, but ony display all the task with isDeleted column set as false, meaning after deleting a task, it won't be removed from the table but it's column isDeleted will be set to true, and when you call the get task endpoint it will not be displayed... cos get task endpoint shows task with isDeleted column set to false, meaning they are not deleted task. 

3. The Auth folder - contains a auth controller, service, module, and dto folder,
  the controller handles the router to login a user, immediately you login as a an active user, it returns an access_token, which last for an hour, use this to authenticate, the next stage to create, read or delete a task.

4. config folder - contains an index.ts file for validating environment (.env) variables, with dotenv and Joi schema package

5. utils folder - contains auth, helpers and index.ts files for some necessary functions

6. Database folder - contains the database.source.ts file for database configurations, and Migrations folder where all migration files are saved
  to run a migration follow the script command inside the `package.json` file for migration:create migration:generate e.t.c

7. Swagger docs - This Rest API server is designed with swagger docs,
  when you run the app for instance `npm run start:dev` in a watch or `npm run start`, it start the app, open the server on your browser with the server url e.g http://localhost:4500/api it will display the app in a swagger docs mode, where it also contains documents about the endpoints...

8. Middlewares folder - contains auth.middleware and ws.middleware file, the auth file contains a use handler which prevents any incoming req if it contains the necessary details to know if the request is coming from the right source, the auth is use for the Rest API if you check the app.module.ts file you will see that it implements the NestModule and apply the auth middleware for each of every route endpoints except for the register and login endpoints.
  the ws file is for the websocket but because on nestjs they don't have way to implement middleware for websocket, I had to go with guard, that was why in the guard folder, it contains a folder name ws-jwt(websocket-jasonwebtoken) inside it a ws-jwt.guard.ts file which implement the CanActivate... 

9. Validation Pipes line `class-validator` used to validate the input dto parameter 

You can test this using `Postman workspace`,

## Endpoints
1. `v1/users/register`: POST method - to create/register a new user, `payloads`: email, password, -- email most be unique, meaning u cannot add another existing email, password- must contain at least 1 Uppercase and 5 lower case.

2. `v1/auth/login`: POST method - to login as an active user, `payloads`: email and password - after login successful, it returns an access_token for authentication and authorization purpose for other endpoints.

3. `v1/tasks/`: POST method - to create a task - `payload`: title and description.

4. `v1/tasks/`: GET method - to get all created task(s).

5. `v1/tasks/:id`: GET method - to get task by an id.

6. `v1/tasks/:id`: PATCH method - to update a particular task status from OPEN to IN_PROGRESS or DONE with this enum TaskStatus found inside the `utils/index.ts` set the body of the status req in any of the TaskStatus e.g status: "IN_PROGRESS".

7. `v1/tasks/:id`: DELETE method - to delete a particular task.

`note`: after the token expires i.e after an hour, login again to get another new access_token.

## Installation
Before you run this application after you have pull or cloned it from the github, run the 'npm install or npm i' to install the necessary packages and it displays the node_modules folder

`note`: add a .env file to the root of the app and add the necessary properties found inside the .env.example file.

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```


## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

