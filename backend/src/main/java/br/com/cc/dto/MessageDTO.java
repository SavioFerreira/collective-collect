package br.com.cc.dto;

import br.com.cc.enums.AuthUserRole;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class MessageDTO {

    private Long id;
    private String content;
    private Long chatId;
    private String userName;
    private LocalDateTime timestamp;
    private AuthUserRole role;

}
