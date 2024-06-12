package br.com.cc.controller;

import br.com.cc.dto.ChatDTO;

import br.com.cc.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/collect/{collectId}/chat")
public class ChatController {
    @Autowired
    private ChatService chatService;

    @GetMapping
    public ChatDTO getChat(@PathVariable Long collectId) {
        return chatService.getChatByCollectId(collectId);
    }

    @PostMapping
    public ChatDTO createChat(@PathVariable Long collectId) {
        return chatService.createChatForCollect(collectId);
    }
}

