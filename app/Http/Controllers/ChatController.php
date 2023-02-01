<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Pusher\Pusher;
use Illuminate\Support\Facades\Validator;

class ChatController extends Controller
{
    public function sendMessage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'receiver_id' => 'required',
            // 'message' => 'required',
        ]);
        if ($validator->fails()) {
            /**Return error message of validation
             */
            return response()->json(['error' => $validator->errors()], 422);
        }


        $message = new ChatMessage;
        $message->user_id = auth()->user()->id;
        $message->receiver_id = $request->receiver_id;
        $message->message = $request->message;

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imagePath = $image->store('public/images');
            $imageUrl = Storage::url($imagePath);
            $message->image = "http://localhost:8000".$imageUrl;
        }

        // $message = ChatMessage::create([
        //     'user_id' => auth()->user()->id,
        //     'receiver_id' => $request->receiver_id,
        //     'message' => $request->message,
        //     'image' => $image_name

        // ]);
        $message->save();

        $pusher = new Pusher(
            env('PUSHER_APP_KEY'),
            env('PUSHER_APP_SECRET'),
            env('PUSHER_APP_ID'),
            [
                'cluster' => env('PUSHER_APP_CLUSTER'),
                'useTLS' => true
            ]
        );
        $pusher->trigger('chat-channel', 'new-message', [
            'message' => $message
        ]);

        return response()->json([
            'message' => $message
        ]);
    }


    public function chatWith($user_id)
    {
        $me = auth()->user()->id;
        $messages = ChatMessage::where(function ($query) use ($user_id, $me) {
            $query->where('user_id', $user_id)
                ->where('receiver_id', $me);
        })->orWhere(function ($query) use ($user_id, $me) {
            $query->where('user_id', $me)
                ->where('receiver_id', $user_id);
        })->get();

        return response()->json($messages);
    }
}
