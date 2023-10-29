package com.aflorzy.daytrackr.services;

import com.aflorzy.daytrackr.domain.DailyEvent;
import com.aflorzy.daytrackr.domain.Event;
import com.aflorzy.daytrackr.domain.UserEntity;
import com.aflorzy.daytrackr.exceptions.DailyEventSaveFailureException;
import com.aflorzy.daytrackr.repositories.DailyEventRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DailyEventService {

    @Autowired
    DailyEventRepository dailyEventRepository;

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

    public DailyEvent findTodayOrLatest(UserEntity user) {
        LocalDate today = LocalDate.now();
        DailyEvent todayOrLatest = dailyEventRepository.findByUserAndDateOrderByDateAsc(user, today);
        if (todayOrLatest == null) {
            todayOrLatest = dailyEventRepository.findTopByUserOrderByDateDesc(user);
        }

        return todayOrLatest;
    }

    public List<DailyEvent> findDaysBetween(UserEntity user, LocalDate date1, LocalDate date2) {
        return dailyEventRepository.findByUserAndDateBetweenOrderByDateAsc(user, date1, date2);
    }

    public DailyEvent save(DailyEvent dailyEvent) {
        try {
            return dailyEventRepository.save(dailyEvent);
        } catch (Exception e) {
            throw new DailyEventSaveFailureException("Could not save DailyEvent of date: " + dailyEvent.getDate());
        }
    }

    public DailyEvent update(DailyEvent dailyEvent) {
        // Retrieve the existing DailyEvent from the database
        Optional<DailyEvent> existingDailyEventOptional = dailyEventRepository.findById(dailyEvent.getId());

        if (existingDailyEventOptional.isPresent()) {
            DailyEvent existingDailyEvent = existingDailyEventOptional.get();

            // Update the properties of the existing DailyEvent
            existingDailyEvent.setDate(dailyEvent.getDate());

            // Update the associated events
            for (Event updatedEvent : dailyEvent.getEvents()) {
                // Find the corresponding existing event by ID
                Event existingEvent = existingDailyEvent.getEvents().stream()
                        .filter(event -> event.getId().equals(updatedEvent.getId()))
                        .findFirst()
                        .orElse(null);

                if (existingEvent != null) {
                    // Update the properties of the existing event
                    existingEvent.setName(updatedEvent.getName());
                    existingEvent.setIdx(updatedEvent.getIdx());
                }
            }

            // Save the updated DailyEvent back to the database
            try {
                return dailyEventRepository.save(existingDailyEvent);
            } catch (Exception e) {
                throw new DailyEventSaveFailureException("Could not save DailyEvent of date: " + dailyEvent.getDate());
            }
        } else {
            try {
                return dailyEventRepository.save(dailyEvent);
            } catch (Exception e) {
                throw new DailyEventSaveFailureException("Could not save DailyEvent of date: " + dailyEvent.getDate());
            }
        }
    }

    public void deleteById(UUID id) {
        dailyEventRepository.deleteById(id);
    }
}
