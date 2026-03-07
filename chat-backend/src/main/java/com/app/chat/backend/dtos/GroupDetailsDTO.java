package com.app.chat.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@AllArgsConstructor
public class GroupDetailsDTO {
    private Long id;
    private String groupName;
    private Long adminId;
    private List<PairDTO> members;
}
