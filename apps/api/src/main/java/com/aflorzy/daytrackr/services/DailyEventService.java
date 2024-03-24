package com.aflorzy.daytrackr.services;

import com.aflorzy.daytrackr.domain.DailyEvent;
import com.aflorzy.daytrackr.domain.Event;
import com.aflorzy.daytrackr.domain.UserEntity;
import com.aflorzy.daytrackr.dto.DailyEventDto;
import com.aflorzy.daytrackr.exceptions.DailyEventSaveFailureException;
import com.aflorzy.daytrackr.exceptions.EventSaveFailureException;
import com.aflorzy.daytrackr.repositories.DailyEventRepository;
import com.aflorzy.daytrackr.repositories.EventRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class DailyEventService {

    @Autowired
    DailyEventRepository dailyEventRepository;

    @Autowired
    EventRepository eventRepository;

    private static final Logger logger = LoggerFactory.getLogger(DailyEventService.class);

    public DailyEvent findByUserAndIdOrderByDateAsc(UserEntity user, UUID id) {
        return dailyEventRepository.findByUserAndIdOrderByDateAsc(user, id);
    }

    public DailyEvent findByUserAndDateOrderByDateAsc(UserEntity user, LocalDate date) {
        return dailyEventRepository.findByUserAndDateOrderByDateAsc(user, date);
    }

    public List<DailyEvent> findByUserOrderByDateAsc(UserEntity user) {
        return dailyEventRepository.findByUserOrderByDateAsc(user);
    }

    public DailyEvent findToday(UserEntity user) {
        LocalDate today = LocalDate.now();
        DailyEvent todayDay = dailyEventRepository.findByUserAndDateOrderByDateAsc(user, today);

        return todayDay;
    }

    public DailyEvent findLatest(UserEntity user) {
        DailyEvent latest = dailyEventRepository.findTopByUserOrderByDateDesc(user);

        return latest;
    }

    public DailyEvent findOldest(UserEntity user) {
        DailyEvent oldest = dailyEventRepository.findTopByUserOrderByDateAsc(user);

        return oldest;
    }

    public DailyEvent findPrevious(UserEntity user, LocalDate date) {
        DailyEvent previous = dailyEventRepository.findTopByUserAndDateBeforeOrderByDateDesc(user, date);

        return previous;
    }

    public DailyEvent findNext(UserEntity user, LocalDate date) {
        DailyEvent next = dailyEventRepository.findTopByUserAndDateAfterOrderByDateAsc(user, date);

        return next;
    }

    public List<DailyEvent> findDaysBetween(UserEntity user, LocalDate date1, LocalDate date2) {
        return dailyEventRepository.findByUserAndDateBetweenOrderByDateAsc(user, date1, date2);
    }

    public DailyEvent save(UserEntity user, DailyEventDto dailyEventDto) {
        logger.info("User " + user.getUsername() + " saving " + dailyEventDto.getDate());

        DailyEvent dailyEvent = new DailyEvent();
        dailyEvent.setUser(user);
        dailyEvent.setId(dailyEventDto.getId());
        dailyEvent.setDate(dailyEventDto.getDate());

        Set<Event> events = new HashSet<>();
        dailyEvent.setEvents(events);
        for(Event event : dailyEventDto.getEvents()) {
            Event eventTemp = new Event();
//            Ignore ID when saving events
            eventTemp.setName(event.getName());
            eventTemp.setIdx(event.getIdx());
            eventTemp.setDailyEvent(dailyEvent);

            events.add(eventTemp);
        }

        dailyEvent.setEvents(events);

        try {
            DailyEvent returnedDailyEvent = dailyEventRepository.save(dailyEvent);
            return returnedDailyEvent;
        } catch (Exception e) {
            return null;
        }
    }

    public void deleteById(UUID id) {
        dailyEventRepository.deleteById(id);
    }
}
