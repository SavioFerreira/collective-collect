package br.com.cc.controller;

import br.com.cc.dto.MessageDTO;
import br.com.cc.entity.Message;
import br.com.cc.mapper.UserMapperService;
import br.com.cc.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/message")
public class MessageController {
    @Autowired
    private MessageService messageService;

    @PostMapping
    public Message sendMessage(@RequestBody MessageDTO messageDTO) {
        return messageService.sendMessage(messageDTO.getChat(), messageDTO.getUser() , messageDTO.getContent());
    }
}


