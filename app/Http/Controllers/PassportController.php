<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class PassportController extends Controller
{
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);
        if ($validator->fails()) {
            /**Return error message of validation
             */
            return response()->json(['error' => $validator->errors()], 422);
        }
        $user = User::where('email', $request->email)->first();
        if ($user) {
            if (Hash::check($request->password, $user->password)) {

                $token = $user->createToken($user->email . '-' . now());
                return response()->json([
                    'token' =>  $token->accessToken,
                    'user' => $user,
                ], 200);
            } else {
                return response()->json(['message' => 'Password mismatch'], 422);
            }
        } else {
            return response()->json(['message' => 'User does not exist'], 404);
        }
    }
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:20|min:3|',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|min:8',
        ]);
        /**Check the validation becomes fails or not*/
        if ($validator->fails()) {
            /**Return error message*/
            return response()->json(['error' => $validator->errors()->all()], 422);
        }
        $request['remember_token'] = Str::random(10);
        $user = User::create([
            'name'     => $request['name'],
            'email'    => $request['email'],
            'password' => Hash::make($request['password']),
        ]);
        $success['message'] = 'user created successfully';
        $success['user'] = $user;

        /**Return success message with token value
         */
        return response()->json(['success' => $success], 200);
    }
    public function getMe()
    {
        //Retrieve the information of the authenticated user
        $user = Auth::user();
        // Return user's details
        return response()->json(['user' => $user], 200);
    }
    public function logout(Request $request)
    {
        $token = $request->user()->token();
        $token->revoke();
        $response = ['message' => 'You have been successfully logged out!'];
        return response($response, 200);
    }

    public function getUsers()
    {
        $users = User::where('id', '!=', auth()->id())->get();
        // Return user's details
        return response()->json(['users' => $users], 200);
    }
}
