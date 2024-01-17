package com.aflorzy.daytrackr.controllers;

import com.aflorzy.daytrackr.domain.UserEntity;
import com.aflorzy.daytrackr.dto.FeedbackMessageDto;
import com.aflorzy.daytrackr.repositories.UserRepository;
import com.aflorzy.daytrackr.services.FeedbackService;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/feedback")
@Slf4j
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @Autowired
    UserRepository userRepository;

    @Transactional
    @PostMapping("")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity sendEmail(Principal principal, @RequestBody FeedbackMessageDto feedbackMessage) {
        UserEntity user = userRepository.findByUsername(principal.getName()).orElse(null);
        return this.feedbackService.sendMail(user, feedbackMessage);
    }
}
