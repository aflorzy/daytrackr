package com.aflorzy.daytrackr.domain.responses;

import com.aflorzy.daytrackr.dto.DailyEventDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseEntityDailyEvent {
    private String message;
    private HttpStatus httpStatus;
    private DailyEventDto dailyEvent;
    private List<DailyEventDto> dailyEventList;
}
