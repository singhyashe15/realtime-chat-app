package com.app.chat.backend.dtos;

import lombok.Data;

@Data
public class UserRequestDTO {
    private String name;
    private String userName;
    private String emailId;
    private String password;
}
