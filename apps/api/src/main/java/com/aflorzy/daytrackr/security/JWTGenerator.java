package com.aflorzy.daytrackr.security;

import com.aflorzy.daytrackr.domain.UserEntity;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
@Slf4j
public class JWTGenerator {

    private final SecurityConstants securityConstants;

    public JWTGenerator(SecurityConstants securityConstants) {
        this.securityConstants = securityConstants;
    }

    public String generateToken(Authentication authentication) {
        String username = authentication.getName();

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime() + securityConstants.getJWT_EXPIRATION()))
                .signWith(SignatureAlgorithm.HS512, securityConstants.getJWT_SECRET())
                .compact();
    }

    public String getUsernameFromJWT(String token) {
        return Jwts.parser()
                .setSigningKey(securityConstants.getJWT_SECRET())
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(securityConstants.getJWT_SECRET()).parseClaimsJws(token);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }
}
