package com.aflorzy.daytrackr.domain;

import lombok.Data;

@Data
public class RefreshTokenRequest {
    private String refreshToken;
}