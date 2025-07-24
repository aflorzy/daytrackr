package com.aflorzy.daytrackr.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "event")
@Data
@ToString
@EqualsAndHashCode
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String name;

    private Integer idx;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "event_id")
    private DailyEvent dailyEvent;

    @Override
    public int hashCode() {
        return Objects.hash(id, name, idx, dailyEvent);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Event event = (Event) o;
        return Objects.equals(id, event.id) &&
                Objects.equals(name, event.name) &&
                Objects.equals(idx, event.idx) &&
                Objects.equals(dailyEvent.getId(), event.dailyEvent.getId());
    }
}
