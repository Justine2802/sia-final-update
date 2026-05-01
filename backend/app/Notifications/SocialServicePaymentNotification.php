<?php
    namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class SocialServicePaymentNotification extends Notification
{
    protected $details;

    public function __construct($details) {
        $this->details = $details;
    }

    public function via($notifiable) {
        return ['mail'];
    }

    public function toMail($notifiable) {
        return (new MailMessage)
            ->subject('Payment Receipt: ' . $this->details['program_name'])
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('This is an automated confirmation of your payment.')
            ->line('Service: ' . $this->details['program_name'])
            ->line('Amount: PHP ' . number_format($this->details['amount'], 2))
            ->line('Status: Processed via Stripe Sandbox')
            ->action('View My Dashboard', url('/home'))
            ->line('Thank you for using the Social Assistance System.');
    }
}
