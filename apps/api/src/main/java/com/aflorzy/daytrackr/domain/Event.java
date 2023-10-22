package com.aflorzy.daytrackr.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Entity
@Table(name = "event")
@Data
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
}
