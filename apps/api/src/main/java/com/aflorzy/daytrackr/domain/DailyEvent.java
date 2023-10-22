package com.aflorzy.daytrackr.domain;

import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "daily_events", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"date", "user_id"})
})
@Data
public class DailyEvent {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private UUID id;

  @ManyToOne
  @JoinColumn(name = "user_id")
  private UserEntity user;

  private LocalDate date;

  @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
  @JoinTable(name = "events", joinColumns = @JoinColumn(name = "daily_event_id", referencedColumnName = "id"))
  private Set<Event> events;

}