package com.aflorzy.daytrackr.dto;

import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

import com.aflorzy.daytrackr.domain.DailyEvent;
import com.aflorzy.daytrackr.domain.Event;
import com.aflorzy.daytrackr.utility.CustomLocalDateDeserializer;
import com.aflorzy.daytrackr.utility.CustomLocalDateSerializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class DailyEventDto {

  private UUID id;
  @JsonSerialize(using = CustomLocalDateSerializer.class)
  @JsonDeserialize(using = CustomLocalDateDeserializer.class)
  private LocalDate date;
  private Set<Event> events;

  public DailyEventDto fromDailyEvent(DailyEvent dailyEvent) {
    if (dailyEvent == null) return null;

    this.id = dailyEvent.getId();
    this.date = dailyEvent.getDate();
    this.events = dailyEvent.getEvents();
    return this;
  }

}
