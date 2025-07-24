package com.aflorzy.daytrackr.controllers;

import com.aflorzy.daytrackr.domain.UserEntity;
import com.aflorzy.daytrackr.domain.responses.ResponseEntityProfile;
import com.aflorzy.daytrackr.domain.responses.ResponseMessage;
import com.aflorzy.daytrackr.dto.FeedbackMessageDto;
import com.aflorzy.daytrackr.dto.ProfileDto;
import com.aflorzy.daytrackr.enums.StatusType;
import com.aflorzy.daytrackr.repositories.UserRepository;
import com.aflorzy.daytrackr.services.FeedbackService;
import com.aflorzy.daytrackr.services.ProfileService;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.autoconfigure.observation.ObservationProperties;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/profile")
@Slf4j
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @Autowired
    UserRepository userRepository;

    @Transactional
    @PostMapping("")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<ResponseMessage> saveProfile(Principal principal, @RequestBody ProfileDto profileDto) {
        UserEntity user = userRepository.findByUsername(principal.getName()).orElse(null);
        user = profileService.updateUser(user, profileDto);
        try {
            log.info("Updating profile for {}", user.getUsername());

            userRepository.save(user);
            return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(new ResponseMessage("Profile updated", StatusType.SUCCESS));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).contentType(MediaType.APPLICATION_JSON).body(new ResponseMessage("Could not update profile", StatusType.ERROR));

        }
    }

    @Transactional
    @GetMapping("")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<ProfileDto> getProfile(Principal principal) {
        UserEntity user = userRepository.findByUsername(principal.getName()).orElse(null);
        ProfileDto profileDto = profileService.getProfileFromUser(user);

        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(profileDto);
    }
}
