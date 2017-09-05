---
layout: post
title: JWT authentication for Lumen 5.4
comments: true
---

Recently I have been tinkering with Angular-4 to get a taste of it and I decided to create a quick project to get my hands dirty. I decided to create a blog with authentication etc. My main focus was on the frontend so I decided to quickly bootstrap an application in Lumen because of its simplicity and almost zero-configuration development. For the authentication, I decided to go with JWT and this post is going to be a quick write-up on how I integrated that and how anyone can integrate JWT authentication in their APIs. Firstly if you are not aware of what JWT Authentication is, I would suggest you to go through [this nice little article]() to get the idea.

I hope you are excited so lets get started.

First things first, let's create an empty lumen project. Open up your terminal and run the following command to create a fresh copy of lumen project on your desktop:

```bash
composer create-project --prefer-dist laravel/lumen lumen-jwt
```

Now we need to create the configuration file i.e. `.env` at the root of directory. Create it by simply copying the content of `.env.example` to `.env`:

```bash 
cd lumen-jwt
cp .env.example .env
``` 

Now lets set a few configuration values in our `.env` file. Open this lumen project in your favorite code editor or IDE and put the below in the `.env` ile:

```
APP_ENV=local
APP_DEBUG=true
APP_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=

CACHE_DRIVER=file

JWT_SECRET=JhbGciOiJIUzI1N0eXAiOiJKV1QiLC
```

> **Note:** Remember to set the `APP_KEY` and `JWT_SECRET` to your own.

Create a migration file for the users table:

```bash
php artisan make:migration create_users_table
```

Modify the migration file created inside the `database/migrations` directory to have `name`, `email` and `password` fields. For me the file is `database/migrations/2017_09_05_115448_create_users_table.php`:

```php
<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('users');
    }
}
```

Now let's define some factory methods that will help us in populating some seed data in the database. Open the file `database/factories/ModelFactory.php`  and modify it to look like below:

```php
<?php

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| Here you may define all of your model factories. Model factories give
| you a convenient way to create models for testing and seeding your
| database. Just tell the factory how a default model should look.
|
*/

$factory->define(App\User::class, function (Faker\Generator $faker) {
    return [
        'name' => $faker->name,
        'email' => $faker->unique()->email,
        'password' => bcrypt('12345'),
    ];
});
```

Now let's create the seeder to populate database with some users. Mmodify `database/seeds/UsersTableSeeder.php` to look like:

```php
<?php

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // create 10 users using the user factory
        factory(App\User::class, 10)->create();
    }
}
```

Now let's register this user seeder in our database seeders. Modify `database/seeds/DatabaseSeeder.php` to look like this:

```php
<?php

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Model::unguard();

        // Register the user seeder
        $this->call(UsersTableSeeder::class);

        Model::reguard();
    }
}
```

Now create the configured database in MySQL and run the following commands inside your terminal to create the users table and add some dummy data respectively:

```bash
php artisan migrate
php artisan db:seed
```

If you run into any errors, run the below to make sure that composer knows about these newly created classes

```
composer dump-autoload
```

Lumen does not have facades and eloquent enabled by default, let's enable them first by opening the `bootstrap/app.php` file and uncommenting the following lines:

```php?start_inline=1
$app->withFacades();
$app->withEloquent();
```

Now let's create the endpoint to generate JWT token. There are tons of libraries out there that will help you with it we will use the one called `firebase/php-jwt`. Open up your terminal and run the following command to pull it in using composer:

```bash
composer require firebase/php-jwt
```

Now let's add the endpoint `POST /auth/login` that will accept the credentials and return a token for us. Let's register the route first by adding the following route inside `routes/web.php` file:

```php
<?php
$app->post('auth/login', ['uses' => 'AuthController@authenticate']);
```

Now we need the controller `AuthController` with method `authenticate`. Inside `app/Http/Controllers` folder create a new `AuthController.php` file and put follwoing content inside it:

> In a production ready application you will probably have models and helper methods to achieve this but for the sake of brevity let's put everything inside the controller.

```php
<?php

namespace App\Http\Controllers;

use Validator;
use App\User;
use Firebase\JWT\JWT;
use Illuminate\Http\Request;
use Firebase\JWT\ExpiredException;
use Illuminate\Support\Facades\Hash;
use Laravel\Lumen\Routing\Controller as BaseController;

class AuthController extends BaseController 
{
    /**
     * The request instance.
     *
     * @var \Illuminate\Http\Request
     */
    private $request;

    /**
     * Create a new controller instance.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return void
     */
    public function __construct(Request $request) {
        $this->request = $request;
    }

    /**
     * Create a new token.
     * 
     * @param  \App\User   $user
     * @return string
     */
    protected function jwt(User $user) {
        $payload = [
            'iss' => "lumen-jwt", // Issuer of the token
            'sub' => $user->id, // Subject of the token
            'iat' => time(), // Time when JWT was issued. 
            'exp' => time() + 60*60 // Expiration time
        ];
        
        // As you can see we are passing `JWT_SECRET` as the second parameter that will 
        // be used to decode the token in the future.
        return JWT::encode($payload, env('JWT_SECRET'));
    } 

    /**
     * Authenticate a user and return the token if the provided credentials are correct.
     * 
     * @param  \App\User   $user 
     * @return mixed
     */
    public function authenticate(User $user) {
        $this->validate($this->request, [
            'email'     => 'required|email',
            'password'  => 'required'
        ]);

        // Find the user by email
        $user = User::where('email', $this->request->input('email'))->first();

        if (!$user) {
            // You wil probably have some sort of helpers or whatever
            // to make sure that you have the same response format for
            // differents kind of responses. But let's return the 
            // below respose for now.
            return response()->json([
                'error' => 'Email does not exist.'
            ], 400);
        }

        // Verify the password and generate the token
        if (Hash::check($this->request->input('password'), $user->password)) {
            return response()->json([
                'token' => $this->jwt($user)
            ], 200);
        }

        // Bad Request response
        return response()->json([
            'error' => 'Email or password is wrong.'
        ], 400);
    }
}
```

Lets open up your terminal and test our authenticate route by sending a post request and check if we are getting token in response.

```bash
curl -X POST -F 'email=ziishaned@gmail.com' -F 'password=admin' http://localhost:8080/auth/login
```

After hitting the route you will get something like following result in response: 

```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJibG9nLmRldiIsInN1YiI6IjU5YWEyYTQ3ZjlkYzQxMTU3ODAwNjM0NiIsImlhdCI6MTUwNDYwNTY1MiwiZXhwIjoxNTA0NjA5MjUyfQ.F-7q5gR7TnLFaHxKhOiacgPlOzAYGgQ1lu5mZ_WWnqI"
}
```

Now we need a middleware to protect our routes. Lets create a middleware `JwtMiddleware` inside `app/Http/Middleware` folder that will validate provided token  and put the following content inside it.

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use App\User;
use Firebase\JWT\JWT;
use Firebase\JWT\ExpiredException;

class JwtMiddleware
{
    public function handle($request, Closure $next, $guard = null)
    {
        $token = $request->get('token');
        
        if(!$token) {
            // Unauthorized response if token not there
            return response()->json([
                'error' => 'Token not provided.'
            ], 401);
        }

        try {
            $credentials = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        } catch(ExpiredException $e) {
            return response()->json([
                'error' => 'Provided token is expired.'
            ], 400);
        } catch(Exception $e) {
            return response()->json([
                'error' => 'An error while decoding token.'
            ], 400);
        }

        $user = User::find($credentials->sub);

        // Now let's put the user in the request class so that you can grab it from there
        $request->auth = $user;

        return $next($request);
    }
}
```

Open the `bootstrap/app.php` file and register our `JwtMiddleware` and alias it with `jwt.auth` or whatever you like.

```php?start_inline=1
$app->routeMiddleware([
    'jwt.auth' => App\Http\Middleware\JwtMiddleware::class,
]);
```

Now let's protect some of our routes. Open the routes file i.e. `routes/web.php` and put the following routes inside it:

```php?start_inline=1
$app->group(['middleware' => 'jwt.auth'], function() use ($app) {
    $app->get('users', function() {
        $users = \App\User:all();
        return response()->json($users);
    });
});
```

Lets open up your terminal and test if our request succeeds by hitting users route. Run the following command inside your terminal:

```bash
curl -X GET http://localhost:8080/users
```

**Output:**

```json
{
  "error": "Token not provided."
}
```

Now lets make another request to users route on which we implemented `jwt.auth` middleware and this time lets put the token that you will get by hitting authenticate route. Run the following commands inside your terminal:

```bash
curl -X POST -F 'email=ziishaned@gmail.com' -F 'password=admin' http://localhost:8080/auth/login
curl -X GET 'http://localhost:8080/api/v1/users?token=tokenFromFirstRequest'
```

**Output:**

```json
[
    {
        "id": 1,
        "email": "johndoe@gmail.com",
        "updated_at": "2017-09-02 03:49:27",
        "created_at": "2017-09-02 03:49:27"
    },
    {
        "id": 2,
        "email": "example@example.com",
        "updated_at": "2017-09-02 03:49:27",
        "created_at": "2017-09-02 03:49:27"
    }
]
```

And that about wraps it up. If you have any questions feel free to leave your comments below.