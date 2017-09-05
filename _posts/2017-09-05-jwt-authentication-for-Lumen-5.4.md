---
layout: post
title: JWT authentication for Lumen 5.4
comments: true
---

Recently I have been developing an angular project so I had to create an API to interact with. I choose [Lumen](https://github.com/laravel/lumen) because it is fast and mostly used to develop APIs. Here is how I implemented it to authenticate a user using [JWT](https://jwt.io/introduction/) authenticate. I hope you are excited so lets get started.

Open up your terminal and run the following command to create a fresh copy of lumen project on your desktop:

```bash
composer create-project --prefer-dist laravel/lumen lumen-jwt
```

Now we need to create `.env` file inside our project root directory. `.env` is over project configuration file. For that we need to run the following commands to create it:

```bash 
cd lumen-jwt
cp .env.example .env
``` 

After that open the `lumen-jwt` folder in your code editor and put the following contents inside `.env` file and also update your database configuration:

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

> **Note:** Remember to set the `APP_KEY` and `JWT_SECRET` to your own. Set them to any meaningless string.

Create a migration file for the users table:

```bash
php artisan make:migration create_users_table
```

Modify the created file `(for me that was database/migrations/2017_09_05_115448_create_users_table.php)` to look like this:

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

Modify `database/factories/ModelFactory.php` to look like this:

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

To create the seeder (it will populate your database with some users), modify `database/seeds/UsersTableSeeder.php` to look like:

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
        factory(App\User::class, 10)->create();
    }
}
```

> **Important**: You must now recreate the autoloader (Lumen still doesn’t know about the UsersTableSeeder class):

```bash
composer dump-autoload
```

Modify `database/seeds/DatabaseSeeder.php` to look like this:

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

        $this->call(UsersTableSeeder::class);

        Model::reguard();
    }
}
```

Create database and run the following commands inside your terminal:

```bash
php artisan migrate
php artisan db:seed
```

Now lets open the `bootstrap/app.php` file and uncomment the following lines:

```php?start_inline=1
$app->withFacades();
$app->withEloquent();
```

To generate and validate jwt token we need to pull a new library `firebase/php-jwt` using composer. So, open up your terminal and run the following command:

```bash
composer require firebase/php-jwt
```

Create following routes inside `routes/web.php` file:

```php
<?php

$app->get('', function () use ($app) {
    return $app->version();
});

$app->post('auth/login', ['uses' => 'AuthController@authenticate']);
```

Inside `app/Http/Controllers` folder create a new `AuthController.php` file and put follwoing content inside it:

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
        
        /*
        | As you can see we passes `JWT_SECRET` as the second parameter that will 
        | be used to decode the token in the feature.
        */
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

        $user = User::where('email', $this->request->input('email'))->first();

        if (!$user) {
            return response()->json([
                'error' => 'Email does not exist.'
            ], 401);
        }

        if (Hash::check($this->request->input('password'), $user->password)) {
            return response()->json([
                'token' => $this->jwt($user)
            ], 200);
        }

        return response()->json([
            'error' => 'Email or password is wrong.'
        ], 401);
    }
}
```

Lets open up your terminal and test our authenticate route by seding a post request and check if we are getting token in response.

```bash
curl -X POST -F 'email=ziishaned@gmail.com' -F 'password=admin' http://localhost:8080/auth/login
```

After hitting the route you will get something like following result in response: 

```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJibG9nLmRldiIsInN1YiI6IjU5YWEyYTQ3ZjlkYzQxMTU3ODAwNjM0NiIsImlhdCI6MTUwNDYwNTY1MiwiZXhwIjoxNTA0NjA5MjUyfQ.F-7q5gR7TnLFaHxKhOiacgPlOzAYGgQ1lu5mZ_WWnqI"
}
```

Lets create a middleware `JwtMiddleware` inside `app/Http/Middleware` folder that will validates provided token  and put the following content inside it.

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

        /*
        | Because of this you can get the current authenticated user 
        | using \Illuminate\Http\Request class.
        */
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

After that open `routes/web.php` file and put the following routes inside it:

```php?start_inline=1
$app->group(['middleware' => 'jwt.auth'], function() use ($app) {
    $app->get('users', function() {
        $users = \App\User:all();
        return response()->json($users);
    });
});
```

Lets open up your terminal and test if our request proceded by hitting users route. Run the following command inside your terminal:

```bash
curl -X GET http://localhost:8080/users
```

**Output:**

```json
{
  "error": "Token not provided."
}
```

Now lets make an other request to users route on which we implemented `jwt.auth` middleware and this time put the token that you will get by hitting authenticate route. Run the following commands inside your terminal:

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