package com.aflorzy.daytrackr.exceptions;

public class EventSaveFailureException extends RuntimeException {
    public EventSaveFailureException(String message) {
        super(message);
    }
}