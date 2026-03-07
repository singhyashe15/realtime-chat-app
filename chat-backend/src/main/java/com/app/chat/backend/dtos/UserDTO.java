package com.app.chat.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String userName;
    private String name;
    private String emailId;

    public UserDTO(String userName, String emailId) {
        this.userName = userName;
        this.emailId = emailId;
    }
}
