package br.com.cc.controller;

import br.com.cc.entity.Chat;
import br.com.cc.entity.Collect;
import br.com.cc.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    @Autowired
    private ChatService chatService;

    @PostMapping
    public Chat criarChat(@RequestBody Collect collect) {
        return chatService.create(collect);
    }

    @GetMapping("/{collectId}")
    public Optional<Chat> obterChat(@PathVariable Long collectId) {
        return chatService.findByCollectId(collectId);
    }
}

