package com.app.chat.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "archive_participants")
@Setter
@Getter
public class ArchiveParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    // Who marked archive
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Who is marked as archive
    @ManyToOne
    @JoinColumn(name = "archive_user_id", nullable = false)
    private User archiveUser;
}
