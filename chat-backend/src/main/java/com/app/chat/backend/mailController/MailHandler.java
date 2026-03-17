package com.app.chat.backend.mailController;

import brevo.ApiException;
import brevoApi.TransactionalEmailsApi;
import brevoModel.SendSmtpEmail;
import brevoModel.SendSmtpEmailSender;
import brevoModel.SendSmtpEmailTo;
import org.springframework.beans.factory.annotation.Value;

import java.util.Collections;

public class MailHandler {
    private final TransactionalEmailsApi emailsApi;

    @Value("${brevo.sender.email}")
    private String fromEmail;
    @Value("${brevo.sender.name}")
    private String fromName;

    public MailHandler(TransactionalEmailsApi emailsApi) {
        this.emailsApi = emailsApi;
    }

    public SendSmtpEmailSender sender(){
        SendSmtpEmailSender sender = new SendSmtpEmailSender()
                .email(fromEmail)
                .name(fromName);
        return sender;
    }

    public SendSmtpEmailTo recipient(String to){
        SendSmtpEmailTo recipient = new SendSmtpEmailTo()
                .email(to);

        return recipient;
    }

    public void  sendOtpNotification(String to , String subject , String otp, String userName) throws ApiException {
            SendSmtpEmailSender sender = sender();
            SendSmtpEmailTo recipient = recipient(to);

            SendSmtpEmail mail = new SendSmtpEmail()
                    .sender(sender)
                    .to(Collections.singletonList(recipient))
                    .subject(subject)
                    .htmlContent(doOtp(otp, userName));

            emailsApi.sendTransacEmail(mail);

    }

    public String doOtp(String otp, String userName) {
        return String.format("""
        <html>
            <body style="font-family:Arial;background:#f4f6fb;padding:30px">
                <div style="max-width:420px;margin:auto;background:#fff;
                      border-radius:16px;padding:12px;text-align:center">
                <h2>Hello %s,</h2>
                <h2 style="color:#10b981">🔐 Verification Code</h2>
                <p>Use the OTP below to continue</p>

                <div style="font-size:32px;font-weight:bold;
                        letter-spacing:6px;margin:20px 0;
                        border:2px solid #10b981;
                        padding:15px;border-radius:12px">
                    %s
                </div>

                <p style="color:#b45309;background:#fef3c7;padding:10px;border-radius:8px">
                    ⏰ Expires in 5 minutes
                </p>

                <p style="color:#6b7280;font-size:14px">
                    If you didn't request this, ignore this email.
                </p>

                <hr>
                <p style="font-size:12px;color:#9ca3af">
                    © Smart Queue Management System
                </p>
                </div>
            </body>
        </html>
        """, userName,otp);
    }
}
