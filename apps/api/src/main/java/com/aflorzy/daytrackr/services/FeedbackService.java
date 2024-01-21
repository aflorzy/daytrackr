package com.aflorzy.daytrackr.services;

import com.aflorzy.daytrackr.domain.FeedbackMessage;
import com.aflorzy.daytrackr.domain.UserEntity;
import com.aflorzy.daytrackr.domain.responses.ResponseMessage;
import com.aflorzy.daytrackr.dto.FeedbackMessageDto;
import com.aflorzy.daytrackr.enums.StatusType;
import com.aflorzy.daytrackr.repositories.FeedbackRepository;
import jakarta.mail.Message;
import jakarta.mail.internet.InternetAddress;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Getter
@Setter
@AllArgsConstructor
@Slf4j
public class FeedbackService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    FileService fileService;

    @Autowired
    private FeedbackRepository feedbackRepository;

    public List<FeedbackMessage> findAll() {
        return feedbackRepository.findAll();
    }

    public Optional<FeedbackMessage> findById(UUID id) {
        return feedbackRepository.findById(id);
    }

    public FeedbackMessage save(FeedbackMessage feedbackMessage) {
        return feedbackRepository.save(feedbackMessage);
    }

    public ResponseMessage sendMail(UserEntity user, FeedbackMessageDto feedbackMessageDto) {
        FeedbackMessage feedbackMessage = new FeedbackMessage();
        feedbackMessage.setMessage(feedbackMessageDto.getMessage());
        feedbackMessage.setSubject(feedbackMessageDto.getSubject());
        if (feedbackMessageDto.getFiles() != null) {
            feedbackMessage.setFiles(fileService.convertMultipartFilesToEntities(feedbackMessageDto.getFiles()));
        }
        feedbackMessage.setTimestamp(new Timestamp(System.currentTimeMillis()));

        try {
            mailSender.send(prepareServerEmail(user, feedbackMessage));

            log.info("Successfully sent email to tbillform@gmail");

            mailSender.send(prepareClientEmail(user, feedbackMessage));

            log.info("Successfully sent email to " + user.getEmail());

            return new ResponseMessage("Feedback submitted successfully.", StatusType.SUCCESS);

        } catch (MailException ex) {
            log.error(ex.getMessage());
            return new ResponseMessage("Could not send feedback.", StatusType.ERROR);
        }
    }

    public MimeMessagePreparator prepareServerEmail(UserEntity user, FeedbackMessage feedbackMessage) {
        return mimeMessage -> {
            mimeMessage.setRecipient(Message.RecipientType.TO, new InternetAddress("tbillform@gmail.com"));
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
            helper.setFrom(new InternetAddress("tbillform@gmail.com"));
            helper.setSubject("DayTrackr | Feedback Received");

            String name = user.getName() == null ? user.getUsername() : user.getFullName();
            String email = user.getEmail();
            String emailBody = ""
                    .concat(name == null ? "" : "<p><strong>Contact name:</strong> " + name + "</p>")
                    .concat(email == null ? "" : "<p><strong>Contact email:</strong> " + email + "</p>")
                    .concat(feedbackMessage.getTimestamp() == null ? "" : "<p><strong>Timestamp:</strong> " + feedbackMessage.getTimestamp() + "</p>")
                    .concat(feedbackMessage.getSubject() == null ? "" : "<p><strong>Subject:</strong> " + feedbackMessage.getSubject() + "</p>")
                    .concat(feedbackMessage.getMessage() == null ? "" : "<p><strong>Feedback:</strong> " + feedbackMessage.getMessage() + "</p>")
                    .concat("");
            helper.setText(emailBody, true);
        };
    }

    public MimeMessagePreparator prepareClientEmail(UserEntity user, FeedbackMessage feedbackMessage) {
        return mimeMessage -> {
            mimeMessage.setRecipient(Message.RecipientType.TO, new InternetAddress(user.getEmail()));
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
            helper.setFrom(new InternetAddress("tbillform@gmail.com"));
            helper.setSubject("DayTrackr | We've received your feedback!");

            String name = user.getName() == null ? user.getUsername() : user.getFullName();
            String email = user.getEmail();
            String emailBody = ""
                    .concat("<h3>Thanks for the feedback! See the details of your message below.</h3>")
                    .concat("<hr/>")
                    .concat("<br/>")
                    .concat(name == null ? "" : "<p><strong>Contact name:</strong> " + name + "</p>")
                    .concat(email == null ? "" : "<p><strong>Contact email:</strong> " + email + "</p>")
                    .concat(feedbackMessage.getSubject() == null ? "" : "<p><strong>Subject:</strong> " + feedbackMessage.getSubject() + "</p>")
                    .concat(feedbackMessage.getMessage() == null ? "" : "<p><strong>Feedback:</strong> " + feedbackMessage.getMessage() + "</p>")
                    .concat("<br/>")
                    .concat("<p>If your feedback requests a response from us, we will get back to you within 1-2 business days.</p>")
                    .concat("<br/>")
                    .concat("<p>Thank you!</p>");
            helper.setText(emailBody, true);
        };
    }

}
