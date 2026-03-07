package com.app.chat.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Setter
@Getter
@Table(name = "message")
@NoArgsConstructor
@AllArgsConstructor
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;
    private String text;
    private String imageUrl;
    private String videoUrl;
    @ManyToOne
    @JoinColumn(name = "sender_id", referencedColumnName = "id", nullable = false)
    private User user;
    @ManyToOne
    @JoinColumn(name = "conv_id")
    private Conversation conversation;
    private Long notAllowedId;
    @Column(name = "created_at")
    private LocalDateTime createdAt;


    public Message(String text, String imageUrl, String videoUrl, User user, Conversation conv) {
        this.text = text;
        this.imageUrl = imageUrl;
        this.videoUrl = videoUrl;
        this.user = user;
        this.conversation = conv;
    }

    @PrePersist
    protected void onCreate(){
        createdAt = LocalDateTime.now();
    }
}
