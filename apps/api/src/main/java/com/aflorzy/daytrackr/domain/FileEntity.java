package com.aflorzy.daytrackr.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileEntity {

    @Id
    @GeneratedValue
    private UUID id;

    private String fileName;
    private String fileType;
    private byte[] data;

    @ManyToOne
    @JoinColumn(name = "feedback_message_id")
    private FeedbackMessage feedbackMessage;
}
