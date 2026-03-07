package com.app.chat.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ConversationUserDTO {
    private Long id;
    private String name;
//    private boolean isOnline;
    private String text;
    private LocalDateTime createdAt;

    public ConversationUserDTO(Long id, String name) {
        this.id = id;
        this.name = name;
    }
}
