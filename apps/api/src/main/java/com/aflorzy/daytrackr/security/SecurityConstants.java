package com.aflorzy.daytrackr.security;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class SecurityConstants {

  @Value("${jwt.expiration}")
  public long JWT_EXPIRATION;

  @Value("${jwt.secret}")
  public String JWT_SECRET;
}