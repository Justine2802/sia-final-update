<!DOCTYPE html>
<html>
<head>
    <title>Payment Confirmed</title>
</head>
<body style="font-family: sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
        <h2 style="color: #635BFF;">Payment Confirmed!</h2>
        <p>Hello Resident,</p>
        <p>This is to confirm that your payment for the <strong>{{ $record->certificate_type }}</strong> has been successfully processed via Stripe.</p>
        
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 8px 0;"><strong>Purpose:</strong></td>
                <td>{{ $record->purpose }}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0;"><strong>Status:</strong></td>
                <td style="color: green;"><strong>PAID</strong></td>
            </tr>
        </table>

        <p style="margin-top: 20px;">You may now claim your document at the Barangay Hall. Please bring a valid ID.</p>
        <hr>
        <p style="font-size: 12px; color: #777;">This is an automated notification from the Barangay Digital System.</p>
    </div>
</body>
</html>