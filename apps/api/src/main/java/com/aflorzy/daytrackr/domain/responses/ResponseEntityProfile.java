package com.aflorzy.daytrackr.domain.responses;

import com.aflorzy.daytrackr.dto.ProfileDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseEntityProfile {
    private String message;
    private HttpStatus httpStatus;
    private ProfileDto profile;
}
