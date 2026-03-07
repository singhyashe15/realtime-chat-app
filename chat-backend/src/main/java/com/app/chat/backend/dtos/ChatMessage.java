package com.app.chat.backend.dtos;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Setter
@Getter
public class ChatMessage {
    Long senderId;
    Long receiverId;
    String text;
    String videoUrl;
    String imageUrl;
    Long groupId;
}
