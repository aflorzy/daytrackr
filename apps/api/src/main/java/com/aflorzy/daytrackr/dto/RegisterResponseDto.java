package com.aflorzy.daytrackr.dto;

import lombok.Data;

@Data
public class RegisterResponseDto {

    public String message;

    public String error;

    public RegisterResponseDto(String message, String error) {
        this.message = message;
        this.error = error;
    }
}
