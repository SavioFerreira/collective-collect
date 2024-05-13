package br.com.cc.dto;

import br.com.cc.entity.User;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CollectCollaboratorDTO {
    private LocalDateTime date;
    private User user;
    private boolean teamCollect;
}
