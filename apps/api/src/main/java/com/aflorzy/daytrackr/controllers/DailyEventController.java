package com.aflorzy.daytrackr.controllers;

import java.security.Principal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.aflorzy.daytrackr.exceptions.DailyEventSaveFailureException;
import com.aflorzy.daytrackr.services.DailyEventService;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.aflorzy.daytrackr.domain.DailyEvent;
import com.aflorzy.daytrackr.domain.DailyEventDto;
import com.aflorzy.daytrackr.domain.UserEntity;
import com.aflorzy.daytrackr.repositories.DailyEventRepository;
import com.aflorzy.daytrackr.repositories.UserRepository;

@RestController
@RequestMapping("/api/daily-events")
public class DailyEventController {

    private static final Logger logger = LoggerFactory.getLogger(DailyEventController.class);


    @Autowired
    DailyEventRepository dailyEventRepository;

    @Autowired
    DailyEventService dailyEventService;

    @Autowired
    UserRepository userRepository;

    public static boolean isFalsy(Object value) {
        return value == null || value.equals(0) || value.equals(false) || value.equals("");
    }

    @GetMapping("/find/id/{id}")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public DailyEventDto find(Principal principal, @PathVariable("id") UUID id) {
        UserEntity user = userRepository.findByUsername(principal.getName()).orElse(null);
        DailyEvent dailyEvent = dailyEventRepository.findByUserAndIdOrderByDateAsc(user, id);

        return new DailyEventDto().fromDailyEvent(dailyEvent);
    }

    @GetMapping("/find/date/{date}")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public DailyEventDto find(Principal principal, @PathVariable("date") LocalDate date) {
        UserEntity user = userRepository.findByUsername(principal.getName()).orElse(null);
        DailyEvent dailyEvent = dailyEventRepository.findByUserAndDateOrderByDateAsc(user, date);

        return new DailyEventDto().fromDailyEvent(dailyEvent);
    }

    @GetMapping("/find/today")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public DailyEventDto findTodayOrLatest(Principal principal) {
        UserEntity user = userRepository.findByUsername(principal.getName()).orElse(null);
        DailyEvent dailyEvent = dailyEventService.findTodayOrLatest(user);

        return new DailyEventDto().fromDailyEvent(dailyEvent);
    }

    @GetMapping("/find/all")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public List<DailyEventDto> findAll(Principal principal) {
        UserEntity user = userRepository.findByUsername(principal.getName()).orElse(null);
        List<DailyEvent> dailyEvents = dailyEventRepository.findByUserOrderByDateAsc(user);
        List<DailyEventDto> dailyEventsDto = new ArrayList<>();
        for (DailyEvent event : dailyEvents) {
            dailyEventsDto.add(new DailyEventDto().fromDailyEvent(event));
        }
        return dailyEventsDto;
    }

    @GetMapping("/find/between")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public List<DailyEventDto> getDailyEventsBetweenDates(
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
        return dailyEventsDto;
    }

    @Transactional
    @PostMapping("/save")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public DailyEventDto save(Principal principal, @RequestBody DailyEventDto dailyEventDto) {
        UserEntity user = userRepository.findByUsername(principal.getName()).orElse(null);

        DailyEvent dailyEvent = new DailyEvent();
        dailyEvent.setUser(user);
        dailyEvent.setId(dailyEventDto.getId());
        dailyEvent.setDate(dailyEventDto.getDate());
        dailyEvent.setEvents(dailyEventDto.getEvents());

        DailyEvent returnedDailyEvent = dailyEvent.getId() == null ? dailyEventService.save(dailyEvent) : dailyEventService.update(dailyEvent);

        return new DailyEventDto().fromDailyEvent(returnedDailyEvent);
    }

    @Transactional
    @PostMapping("/save/multi")
    public List<DailyEventDto> saveMulti(Principal principal, @RequestBody List<DailyEventDto> dailyEventDtoList) {
        UserEntity user = userRepository.findByUsername(principal.getName()).orElse(null);
        List<DailyEventDto> result = new ArrayList<>();
        for (DailyEventDto dailyEventDto : dailyEventDtoList) {
            DailyEvent dailyEvent = new DailyEvent();
            dailyEvent.setUser(user);
            dailyEvent.setId(dailyEventDto.getId());
            dailyEvent.setDate(dailyEventDto.getDate());
            dailyEvent.setEvents(dailyEventDto.getEvents());

            try {
                DailyEvent returnedDailyEvent = dailyEvent.getId() == null ? dailyEventService.save(dailyEvent) : dailyEventService.update(dailyEvent);
                result.add(new DailyEventDto().fromDailyEvent(returnedDailyEvent));
            } catch (Exception e) {
                logger.error(e.getMessage());
                throw new DailyEventSaveFailureException("Could not save DailyEvent of date: " + dailyEvent.getDate());
            }
        }

        return result;
    }
}
