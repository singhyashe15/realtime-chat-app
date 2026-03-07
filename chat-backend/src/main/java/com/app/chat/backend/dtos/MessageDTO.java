package com.app.chat.backend.dtos;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MessageDTO {
    private Long id;
    private Long senderId;
    private String senderName;
    private String text;
    private String imageUrl;
    private String videoUrl;
    private LocalDateTime createdAt;
}
