@extends('layouts.app')

@section('content')
<div class="container text-center py-5">
    <div class="card shadow-sm p-4">
        <h1 class="text-success">Payment Successful!</h1>
        <p class="lead">Thank you for your payment. Your request is now being processed.</p>
        <hr>
        <p>A confirmation email has been automatically sent to <strong>{{ Auth::user()->email }}</strong> via Mailtrap.</p>
        <a href="/home" class="btn btn-primary">Return to Dashboard</a>
    </div>
</div>
@endsection

