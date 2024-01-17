package com.aflorzy.daytrackr.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class FeedbackMessageDto {
    private String subject;
    private String message;
    private List<MultipartFile> files;
}
