package com.aflorzy.daytrackr.domain.responses;

import com.aflorzy.daytrackr.enums.StatusType;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResponseMessage {

    private String message;
    private StatusType statusType;

}
