package br.com.cc.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MessageDTO {

    private Long id;
    private String content;
    private Long chatId;
    private Long userId;
}
