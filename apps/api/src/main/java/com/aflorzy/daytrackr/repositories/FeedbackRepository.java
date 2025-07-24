package com.aflorzy.daytrackr.repositories;

import com.aflorzy.daytrackr.domain.FeedbackMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface FeedbackRepository extends JpaRepository<FeedbackMessage, UUID> {
}
