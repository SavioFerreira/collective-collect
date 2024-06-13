package br.com.cc.controller;

import br.com.cc.dto.ChatDTO;
import br.com.cc.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/collect/{collectId}/chat")
public class ChatController {
    @Autowired
    private ChatService chatService;

    @GetMapping
    public ResponseEntity<ChatDTO> getOrCreateChat(@PathVariable Long collectId) {
        ChatDTO chatDTO = chatService.getOrCreateChatByCollectId(collectId);
        return ResponseEntity.ok(chatDTO);
    }

}

