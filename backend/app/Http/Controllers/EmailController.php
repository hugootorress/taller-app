<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use App\Models\Email;

class EmailController extends Controller
{
    public function send(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'to' => 'required|email',
            'subject' => 'required|string',
            'body' => 'required|string',
            'from_email' => 'required|email',
            'from_name' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Datos inválidos',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            Mail::raw($request->body, function ($message) use ($request) {
                $message->from($request->from_email, $request->from_name)
                        ->to($request->to)
                        ->subject($request->subject);
            });

            Email::create([
                'from_email' => $request->from_email,
                'from_name' => $request->from_name,
                'to_email' => $request->to,
                'subject' => $request->subject,
                'body' => $request->body,
                'is_sent' => true,
            ]);

            return response()->json(['message' => 'Correo enviado y registrado correctamente']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al enviar el correo',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function inbox(Request $request)
{
    $user = $request->user();  

    if (!$user) {
        return response()->json(['message' => 'No autenticado'], 401);
    }

    $email = $user->email; 

    $received = Email::where('to_email', $email)->orderBy('created_at', 'desc')->get();
    $sent = Email::where('from_email', $email)->orderBy('created_at', 'desc')->get();

    return response()->json([
        'received' => $received,
        'sent' => $sent,
    ]);
}

}
