package br.com.cc.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CollectCollaboratorDTO {
    private LocalDateTime date;
    private UserDTO user;
    private boolean teamCollect;
}
