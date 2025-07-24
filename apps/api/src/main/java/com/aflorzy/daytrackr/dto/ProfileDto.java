package com.aflorzy.daytrackr.dto;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class ProfileDto {

    @Email(message = "Invalid email address")
    private String email;
    private String phone;
    private String firstName;
    private String lastName;
    private String preferredName;

}
