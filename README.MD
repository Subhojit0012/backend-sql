## BACKEND (REST API)

## Folder Structure

- Main file: index.js
- Controllers:
- Database
- Routes
- utils
- middleware
- Environment variable

`Index.js:` This is the main file from where server run starts.
There is all kind of configurations are here like and most of them are used as middleware.

`Controllers`: 
 * Files: <Br>
        ``` auth.controller.js ``` 

`Middleware`: 
* Files:<Br>
        ``` auth.middleware.js ```

`routes`: 
* Files: <Br>
        ``` user.route.js ```

`utils`:
* Files: 
    - ``` apiError.js ```
    - ``` apiResponse.js ```
    - ``` emailVerify.js ```

`Database`: 
* ORM: `Prisma`
* db : `Neon`