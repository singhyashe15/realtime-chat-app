package com.app.chat.backend.dtos;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Setter
@Getter
public class GroupDTO {
    private String groupName;
    private List<Long> members;

}
