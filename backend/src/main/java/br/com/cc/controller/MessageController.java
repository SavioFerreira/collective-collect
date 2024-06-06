package br.com.cc.controller;

import br.com.cc.dto.MessageDTO;
import br.com.cc.entity.Message;
import br.com.cc.entity.User;
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

    @Autowired
    private UserMapperService userMapperService;

    @PostMapping
    public Message sendMessage(@RequestBody MessageDTO messageDTO) {
        User user = userMapperService.convertUserToEntity(messageDTO.getUser());
        return messageService.sendMessage(messageDTO.getChat(), user, messageDTO.getContent());
    }
}


