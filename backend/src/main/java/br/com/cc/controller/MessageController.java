package br.com.cc.controller;

import br.com.cc.dto.MessageDTO;
import br.com.cc.entity.Message;
import br.com.cc.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat/{chatId}/messages")
public class MessageController {
    @Autowired
    private MessageService messageService;

    @GetMapping
    public List<MessageDTO> getMessages(@PathVariable Long chatId) {
        return messageService.getMessagesByChatId(chatId);
    }

    @PostMapping
    public MessageDTO sendMessage(@PathVariable Long chatId, @RequestBody String content) {
        return messageService.sendMessage(chatId, content);
    }
}


