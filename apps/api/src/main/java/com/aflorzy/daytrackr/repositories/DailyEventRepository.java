package com.aflorzy.daytrackr.repositories;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aflorzy.daytrackr.domain.DailyEvent;
import com.aflorzy.daytrackr.domain.UserEntity;

public interface DailyEventRepository extends JpaRepository<DailyEvent, UUID> {
  DailyEvent findByUserAndDateOrderByDateAsc(UserEntity user, LocalDate date);

  DailyEvent findByUserAndIdOrderByDateAsc(UserEntity user, UUID id);

  DailyEvent findTopByUserOrderByDateDesc(UserEntity user);

  DailyEvent findTopByUserOrderByDateAsc(UserEntity user);

  DailyEvent findTopByUserAndDateBeforeOrderByDateDesc(UserEntity user, LocalDate date);

  DailyEvent findTopByUserAndDateAfterOrderByDateAsc(UserEntity user, LocalDate date);

  List<DailyEvent> findByUserOrderByDateAsc(UserEntity user);

  List<DailyEvent> findByUserAndDateBetweenOrderByDateAsc(UserEntity user, LocalDate date1, LocalDate date2);
}
