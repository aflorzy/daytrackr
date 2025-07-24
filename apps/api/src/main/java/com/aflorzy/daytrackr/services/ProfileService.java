package com.aflorzy.daytrackr.services;

import com.aflorzy.daytrackr.domain.UserEntity;
import com.aflorzy.daytrackr.dto.ProfileDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class ProfileService {

    public UserEntity updateUser(UserEntity user, ProfileDto profileDto) {
        String email = profileDto.getEmail();
        String phone = profileDto.getPhone();
        String firstName = profileDto.getFirstName();
        String lastName = profileDto.getLastName();
        String preferredName = profileDto.getPreferredName();

        if (email != null) user.setEmail(email);
        if (phone != null) user.setPhone(phone);
        if (firstName != null) user.setFirstName(firstName);
        if (lastName != null) user.setLastName(lastName);
        if (preferredName != null) user.setPreferredName(preferredName);

        return user;
    }

    public ProfileDto getProfileFromUser(UserEntity user) {
        String email = user.getEmail();
        String phone = user.getPhone();
        String firstName = user.getFirstName();
        String lastName = user.getLastName();
        String preferredName = user.getPreferredName();

        ProfileDto profileDto = new ProfileDto();

        profileDto.setEmail(email);
        profileDto.setPhone(phone);
        profileDto.setFirstName(firstName);
        profileDto.setLastName(lastName);
        profileDto.setPreferredName(preferredName);

        return profileDto;
    }
}
