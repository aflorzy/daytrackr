package com.aflorzy.daytrackr.controllers;

import java.security.Principal;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/home")
public class HomeController {

  @GetMapping("/hello")
  public String hello(@RequestParam String name) {
    return "Hello, " + name + "!";
  }

  @GetMapping("")
  public String home(Principal principal) {
    if (principal == null)
      return "Hello, stranger!";
    return "Hello, " + principal.getName();
  }

  @PreAuthorize("hasAuthority('ROLE_USER')")
  @GetMapping("/secure")
  public String secure() {
    return "This is secured!";
  }

}
