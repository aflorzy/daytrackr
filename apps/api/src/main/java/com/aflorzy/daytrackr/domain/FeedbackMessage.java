package com.aflorzy.daytrackr.domain;

import jakarta.persistence.*;
import lombok.*;


import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackMessage {

    @Id
    @GeneratedValue
    private UUID id;

    private String subject;
    private String message;

    @OneToMany(mappedBy = "feedbackMessage", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FileEntity> files = new ArrayList<>();

    private Timestamp timestamp;


}
