package com.app.chat.backend.dtos;

import lombok.Data;

@Data
public class LoginRequestDTO {
    private String userName;
    private String emailId;
    private String password;
}
