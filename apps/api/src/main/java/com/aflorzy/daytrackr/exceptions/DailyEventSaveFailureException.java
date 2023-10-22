package com.aflorzy.daytrackr.exceptions;

public class DailyEventSaveFailureException extends RuntimeException {
    public DailyEventSaveFailureException(String message) {
        super(message);
    }
}