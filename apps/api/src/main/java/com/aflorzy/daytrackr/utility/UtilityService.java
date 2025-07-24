package com.aflorzy.daytrackr.utility;

import org.springframework.stereotype.Service;

@Service
public class UtilityService {

    public static boolean isFalsy(Object value) {
        return value == null || value.equals(0) || value.equals(false) || value.equals("");
    }

}
