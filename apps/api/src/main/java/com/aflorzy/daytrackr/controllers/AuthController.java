package com.aflorzy.daytrackr.controllers;

import java.security.Principal;
import java.util.Collections;

import com.aflorzy.daytrackr.domain.RefreshTokenRequest;
import com.aflorzy.daytrackr.domain.responses.ResponseMessage;
import com.aflorzy.daytrackr.dto.RegisterResponseDto;
import com.aflorzy.daytrackr.enums.StatusType;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.aflorzy.daytrackr.domain.Role;
import com.aflorzy.daytrackr.domain.UserEntity;
import com.aflorzy.daytrackr.dto.AuthResponseDto;
import com.aflorzy.daytrackr.dto.LoginDto;
import com.aflorzy.daytrackr.dto.RegisterDto;
import com.aflorzy.daytrackr.repositories.RoleRepository;
import com.aflorzy.daytrackr.repositories.UserRepository;
import com.aflorzy.daytrackr.security.JWTGenerator;

@RestController
@RequestMapping("/api/auth")
@Slf4j
public class AuthController {

  @Autowired
  private AuthenticationManager authenticationManager;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private RoleRepository roleRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private JWTGenerator jwtGenerator;

  @PostMapping("login")
  public ResponseEntity<?> login(@Valid @RequestBody LoginDto loginDto) {
    try {
      Authentication authentication = authenticationManager.authenticate(
              new UsernamePasswordAuthenticationToken(
                      loginDto.getUsername(),
                      loginDto.getPassword()
              )
      );

      SecurityContextHolder.getContext().setAuthentication(authentication);

      String accessToken = jwtGenerator.generateToken(authentication);
      String refreshToken = jwtGenerator.generateRefreshToken(authentication.getName());

      log.info("Successfully logged in user {}", loginDto.getUsername());

      return ResponseEntity.ok(new AuthResponseDto(accessToken, refreshToken));
    } catch (AuthenticationException e) {
      log.error("Failed login attempt by user {}", loginDto.getUsername());

      return ResponseEntity.status(403).body(new ResponseMessage("Failed to login. Please check your credentials", StatusType.ERROR));
    }
  }

  @PostMapping("register")
  public ResponseEntity<RegisterResponseDto> register(@RequestBody RegisterDto registerDto) {
    if (userRepository.existsByUsername(registerDto.getUsername())) {
      return new ResponseEntity<>(new RegisterResponseDto(null, "Username is already taken!"), HttpStatus.BAD_REQUEST);
    }

    UserEntity user = new UserEntity();
    user.setUsername(registerDto.getUsername());
    user.setPassword(passwordEncoder.encode((registerDto.getPassword())));

    Role roles = roleRepository.findByName("ROLE_USER").orElseThrow(
        () -> new RuntimeException("Error: Role is not found."));
    user.setRoles(Collections.singletonList(roles));

    userRepository.save(user);

    log.info("Successfully registered user {}", user.getUsername());

    return new ResponseEntity<>(new RegisterResponseDto("User registered successfully!", null), HttpStatus.OK);
  }

  @PostMapping("refresh-token")
  public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequest request) {
    if (jwtGenerator.validateRefreshToken(request.getRefreshToken())) {
      String username = jwtGenerator.getUsernameFromJWT(request.getRefreshToken());
      String accessToken = jwtGenerator.generateTokenWithUsername(username);

      return ResponseEntity.ok(new AuthResponseDto(accessToken, request.getRefreshToken()));
    }

    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new ResponseMessage("Invalid refresh token", StatusType.ERROR));
  }
}
