package com.aflorzy.daytrackr.utility;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.time.LocalDate;
import java.io.IOException;
import java.time.format.DateTimeFormatter;

public class CustomLocalDateSerializer extends JsonSerializer<LocalDate> {
    @Override
    public void serialize(LocalDate date, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        jsonGenerator.writeObject(date.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
    }
}