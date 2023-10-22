package com.aflorzy.daytrackr.controllers;

import java.util.Collections;

import com.aflorzy.daytrackr.dto.RegisterResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
public class AuthController {

  private AuthenticationManager authenticationManager;
  private UserRepository userRepository;
  private RoleRepository roleRepository;
  private PasswordEncoder passwordEncoder;
  private JWTGenerator jwtGenerator;

  public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository,
      RoleRepository roleRepository, PasswordEncoder passwordEncoder, JWTGenerator jwtGenerator) {
    this.authenticationManager = authenticationManager;
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtGenerator = jwtGenerator;
  }

  @PostMapping("login")
  public ResponseEntity<AuthResponseDto> login(@RequestBody LoginDto loginDto) {
    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            loginDto.getUsername(),
            loginDto.getPassword()));
    SecurityContextHolder.getContext().setAuthentication(authentication);
    String token = jwtGenerator.generateToken(authentication);
    return new ResponseEntity<>(new AuthResponseDto(token), HttpStatus.OK);
  }

  @PostMapping("register")
  public ResponseEntity<RegisterResponseDto> register(@RequestBody RegisterDto registerDto) {
    if (userRepository.existsByUsername(registerDto.getUsername())) {
      return new ResponseEntity<>(new RegisterResponseDto(null, "Username is taken!"), HttpStatus.BAD_REQUEST);
    }

    UserEntity user = new UserEntity();
    user.setUsername(registerDto.getUsername());
    user.setPassword(passwordEncoder.encode((registerDto.getPassword())));

    Role roles = roleRepository.findByName("ROLE_USER").orElseThrow(
        () -> new RuntimeException("Error: Role is not found."));
    user.setRoles(Collections.singletonList(roles));

    userRepository.save(user);

    return new ResponseEntity<>(new RegisterResponseDto("User registered successfully!", null), HttpStatus.OK);
  }

}
