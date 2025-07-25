-- daytrackr.FeedbackMessage definition

CREATE TABLE `FeedbackMessage` (
  `id` binary(16) NOT NULL,
  `message` varchar(255) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `timestamp` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- daytrackr.roles definition

CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_ofx66keruapi6vyqpv6f2or37` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- daytrackr.users definition

CREATE TABLE `users` (
  `id` binary(16) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `preferredName` varchar(255) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_r43af9ap4edm43mmtq01oddj6` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- daytrackr.FileEntity definition

CREATE TABLE `FileEntity` (
  `id` binary(16) NOT NULL,
  `data` varbinary(255) DEFAULT NULL,
  `fileName` varchar(255) DEFAULT NULL,
  `fileType` varchar(255) DEFAULT NULL,
  `feedback_message_id` binary(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKgv9hiqfdssintdw82kusga1yn` (`feedback_message_id`),
  CONSTRAINT `FKgv9hiqfdssintdw82kusga1yn` FOREIGN KEY (`feedback_message_id`) REFERENCES `FeedbackMessage` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- daytrackr.daily_events definition

CREATE TABLE `daily_events` (
  `id` binary(16) NOT NULL,
  `date` date DEFAULT NULL,
  `user_id` binary(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKmdc42n4arghqaolilqeepprx` (`date`,`user_id`),
  KEY `FKbrtbcjx3kg53p7x2rmhn8xgki` (`user_id`),
  CONSTRAINT `FKbrtbcjx3kg53p7x2rmhn8xgki` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- daytrackr.event definition

CREATE TABLE `event` (
  `id` binary(16) NOT NULL,
  `idx` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `event_id` binary(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK4pn987n96q6k2kk1eerkxebq4` (`event_id`),
  CONSTRAINT `FK4pn987n96q6k2kk1eerkxebq4` FOREIGN KEY (`event_id`) REFERENCES `daily_events` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- daytrackr.events definition

CREATE TABLE `events` (
  `daily_event_id` binary(16) NOT NULL,
  `events_id` binary(16) NOT NULL,
  PRIMARY KEY (`daily_event_id`,`events_id`),
  UNIQUE KEY `UK_e7vet0q65hr0w7nm74piq0hl6` (`events_id`),
  CONSTRAINT `FKcaijtcbtbmc4xkddtu3jkwkm2` FOREIGN KEY (`daily_event_id`) REFERENCES `daily_events` (`id`),
  CONSTRAINT `FKdfdc8smt85l30n0owfsrhxbm4` FOREIGN KEY (`events_id`) REFERENCES `event` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- daytrackr.user_roles definition

CREATE TABLE `user_roles` (
  `user_id` binary(16) NOT NULL,
  `role_id` int NOT NULL,
  KEY `FKh8ciramu9cc9q3qcqiv4ue8a6` (`role_id`),
  KEY `FKhfh9dx7w3ubf1co1vdev94g3f` (`user_id`),
  CONSTRAINT `FKh8ciramu9cc9q3qcqiv4ue8a6` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `FKhfh9dx7w3ubf1co1vdev94g3f` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;