<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Resend\Client;

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

        if ($request->from_email !== 'onboarding@resend.dev' || $request->to !== 'hugales2005@gmail.com') {
            return response()->json([
                'message' => 'Solo puedes enviar correos desde onboarding@resend.dev a hugales2005@gmail.com (taller).',
            ], 403);
        }

        try {
            // Usar la clase Resend global para crear el cliente correctamente
            $resend = \Resend::client(env('RESEND_API_KEY'));
            $result = $resend->emails->send([
                'from' => $request->from_name . ' <' . $request->from_email . '>',
                'to' => [$request->to],
                'subject' => $request->subject,
                'html' => nl2br($request->body),
            ]);

            if (isset($result['error'])) {
                return response()->json([
                    'message' => 'Error al enviar el correo con Resend',
                    'error' => $result['error'],
                ], 500);
            }

            return response()->json(['message' => 'Correo enviado correctamente']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al enviar el correo',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
