package br.com.cc.dto;

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

}
