package com.aflorzy.daytrackr.controllers;

import java.security.Principal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.UUID;

import com.aflorzy.daytrackr.domain.responses.ResponseEntityDailyEvent;
import com.aflorzy.daytrackr.domain.responses.ResponseMessage;
import com.aflorzy.daytrackr.enums.StatusType;
import com.aflorzy.daytrackr.exceptions.DailyEventSaveFailureException;
import com.aflorzy.daytrackr.services.DailyEventService;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.aflorzy.daytrackr.domain.DailyEvent;
import com.aflorzy.daytrackr.dto.DailyEventDto;
import com.aflorzy.daytrackr.domain.UserEntity;
import com.aflorzy.daytrackr.repositories.UserRepository;

@RestController
@RequestMapping("/api/daily-events")
@Slf4j
public class DailyEventController {

    @Autowired
    DailyEventService dailyEventService;

    @Autowired
    UserRepository userRepository;

    @GetMapping("/find/id/{id}")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<DailyEventDto> findById(Principal principal, @PathVariable("id") UUID id) {
        UserEntity user = userRepository.findByUsername(principal.getName()).orElse(null);
        DailyEvent dailyEvent = dailyEventService.findByUserAndIdOrderByDateAsc(user, id);

        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(new DailyEventDto().fromDailyEvent(dailyEvent));
    }

    @GetMapping("/find/date/{date}")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<DailyEventDto> findByDate(Principal principal, @PathVariable("date") LocalDate date) {
        UserEntity user = userRepository.findByUsername(principal.getName()).orElse(null);
        DailyEvent dailyEvent = dailyEventService.findByUserAndDateOrderByDateAsc(user, date);

        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(new DailyEventDto().fromDailyEvent(dailyEvent));
    }

    @GetMapping("/find/today")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<DailyEventDto> findToday(Principal principal) {
        UserEntity user = userRepository.findByUsername(principal.getName()).orElse(null);
        DailyEvent dailyEvent = dailyEventService.findToday(user);

        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(new DailyEventDto().fromDailyEvent(dailyEvent));
    }

    @GetMapping("/find/latest")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<DailyEventDto> findLatest(Principal principal) {
        UserEntity user = userRepository.findByUsername(principal.getName()).orElse(null);
        DailyEvent dailyEvent = dailyEventService.findLatest(user);

        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(new DailyEventDto().fromDailyEvent(dailyEvent));
    }

    @GetMapping("/find/all")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<List<DailyEventDto>> findAll(Principal principal) {
        UserEntity user = userRepository.findByUsername(principal.getName()).orElse(null);
        List<DailyEvent> dailyEvents = dailyEventService.findByUserOrderByDateAsc(user);
        List<DailyEventDto> dailyEventsDto = new ArrayList<>();
        for (DailyEvent event : dailyEvents) {
            dailyEventsDto.add(new DailyEventDto().fromDailyEvent(event));
        }

        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(dailyEventsDto);

    }

    @GetMapping("/find/between")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<List<DailyEventDto>> getDailyEventsBetweenDates(
            Principal principal,
            @RequestParam LocalDate date1,
            @RequestParam LocalDate date2
    ) {
      UserEntity user = userRepository.findByUsername(principal.getName()).orElse(null);
      List<DailyEvent> dailyEvents = dailyEventService.findDaysBetween(user, date1, date2);

        List<DailyEventDto> dailyEventsDto = new ArrayList<>();
        for (DailyEvent event : dailyEvents) {
            dailyEventsDto.add(new DailyEventDto().fromDailyEvent(event));
        }

        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(dailyEventsDto);
    }

    @Transactional
    @PostMapping("/save")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<DailyEventDto> save(Principal principal, @RequestBody DailyEventDto dailyEventDto) {
        UserEntity user = userRepository.findByUsername(principal.getName()).orElse(null);

        DailyEvent returnedDailyEvent = null;
        try {
            returnedDailyEvent = dailyEventService.save(user, dailyEventDto);
        } catch (Exception e) {
            log.error("Could not save day: " + dailyEventDto.getDate());
        }

        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(new DailyEventDto().fromDailyEvent(returnedDailyEvent));
    }

    @Transactional
    @PostMapping("/save/multi")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<List<DailyEventDto>> saveMulti(Principal principal, @RequestBody List<DailyEventDto> dailyEventDtoList) {
        UserEntity user = userRepository.findByUsername(principal.getName()).orElse(null);
        List<DailyEventDto> result = new ArrayList<>();
        for (DailyEventDto dailyEventDto : dailyEventDtoList) {
            try {
                DailyEvent returnedDailyEvent = dailyEventService.save(user, dailyEventDto);
                result.add(new DailyEventDto().fromDailyEvent(returnedDailyEvent));
            } catch (Exception e) {
                throw new DailyEventSaveFailureException("Could not save DailyEvent of date: " + dailyEventDto.getDate());
            }
        }

        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(result);
    }

    @Transactional
    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity deleteDailyEvent(Principal principal, @PathVariable UUID id) {
        UserEntity user = userRepository.findByUsername(principal.getName()).orElse(null);
        DailyEvent dailyEvent = dailyEventService.findByUserAndIdOrderByDateAsc(user, id);

        if (dailyEvent == null) {
            log.error("Could not find day to delete with ID " + id);
            return ResponseEntity.notFound().build();
        }

        if (!dailyEvent.getUser().getUsername().equals(user.getUsername())) {
            log.error("User " + user.getUsername() + " is not authorized to delete day with ID " + id);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // If the user has the right permissions, delete the DailyEvent
        dailyEventService.deleteById(id);
        log.info("User " + user.getUsername() + " successfully deleted day with ID " + id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
