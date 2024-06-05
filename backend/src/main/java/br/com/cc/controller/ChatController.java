package br.com.cc.controller;

import br.com.cc.entity.Chat;
import br.com.cc.entity.Collect;
import br.com.cc.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    @Autowired
    private ChatService chatService;

    @PostMapping
    public Chat criarChat(@RequestBody Collect collect) {
        return chatService.create(collect);
    }
}

