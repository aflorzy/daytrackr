package com.aflorzy.daytrackr.domain;

import java.time.LocalDate;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@Table(name = "daily_events", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"date", "user_id"})
})
@Data
@ToString
@EqualsAndHashCode
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

  @Override
  public int hashCode() {
    return Objects.hash(id, date, user);
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    DailyEvent that = (DailyEvent) o;
    return Objects.equals(id, that.id) &&
            Objects.equals(date, that.date) &&
            Objects.equals(user, that.user);
  }
}