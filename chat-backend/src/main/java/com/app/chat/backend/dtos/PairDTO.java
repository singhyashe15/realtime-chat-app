package com.app.chat.backend.dtos;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class PairDTO<Long, String> {
    public Long id;
    public String name;
}
