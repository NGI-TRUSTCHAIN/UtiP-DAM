package com.utipdam.mobility;

import com.utipdam.mobility.model.Email;
import jakarta.mail.*;
import jakarta.mail.internet.*;
import org.owasp.html.HtmlPolicyBuilder;
import org.owasp.html.PolicyFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Properties;

@Component
public class SendEmail {
    @Value("${utipdam.app.host}")
    private String SMTP_AUTH_HOST;

    @Value("${utipdam.app.username}")
    private String SMTP_AUTH_USERNAME;

    @Value("${utipdam.app.password}")
    private String SMTP_AUTH_PASSWORD;

    @Value("${utipdam.app.port}")
    private Integer SMTP_AUTH_PORT;

    @Value("${utipdam.app.contactEmail}")
    public String CONTACT_EMAIL;

    public String send(Email email){
        Properties prop = new Properties();
        prop.put("mail.smtp.auth", true);
        prop.put("mail.smtp.starttls.enable", "true");
        prop.put("mail.smtp.host", SMTP_AUTH_HOST);
        prop.put("mail.smtp.port", SMTP_AUTH_PORT);
        prop.put("mail.smtp.ssl.trust", SMTP_AUTH_HOST);

        Session session = Session.getInstance(prop, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(SMTP_AUTH_USERNAME, SMTP_AUTH_PASSWORD);
            }
        });

        Message message = new MimeMessage(session);
        String toEmail = email.getRecipientEmail() == null ? CONTACT_EMAIL : email.getRecipientEmail();
        try {
            message.setFrom(new InternetAddress(SMTP_AUTH_USERNAME));
            message.setRecipients(
                    Message.RecipientType.TO, InternetAddress.parse(toEmail));

            String subject = email.getRecipientEmail() != null && email.getSubject() == null ? "[UtiP-DAM] Web channel inquiry" : email.getSubject();
            subject = subject == null ? "[Contact Us] Web channel inquiry" : subject;
            message.setSubject(subject);

            String msg = "From: " + email.getName() + "<br/>";
            msg = msg + "Email: " + email.getContactEmail() + "<br/><br/><br/>";

            String body = sanitizeHTML(email.getMessage());
            msg = msg + body;


            String footer ="<br/><br/><center><b style='color:blue;'>Sent by <a href=\"https://ngi.cs.co.il\" target=\"_blank\">UtiP-DAM</a><br/>ⓒ 2024 Correlation Systems</b><br/><br/></center>";

            msg = msg + footer;

            MimeBodyPart mimeBodyPart = new MimeBodyPart();
            mimeBodyPart.setContent(msg, "text/html; charset=utf-8");

            Multipart multipart = new MimeMultipart();
            multipart.addBodyPart(mimeBodyPart);

            message.setContent(multipart);

            Transport.send(message);

            return "Successfully sent";
        }catch (MessagingException e){
            return e.getMessage();
        }

    }

    private String sanitizeHTML(String untrustedHTML){
        PolicyFactory policy = new HtmlPolicyBuilder()
                .allowAttributes("src").onElements("img")
                .allowAttributes("href").onElements("a")
                .allowStandardUrlProtocols()
                .allowElements(
                        "a", "img"
                ).toFactory();

        return policy.sanitize(untrustedHTML);
    }

}