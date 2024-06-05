package br.com.cc.dto;

import br.com.cc.entity.Chat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageDTO {

    private Chat chat;
    private UserDTO user;
    private String content;
}
