package br.com.cc.service.impl;

import br.com.cc.dto.ChatDTO;
import br.com.cc.entity.Chat;
import br.com.cc.entity.Collect;
import br.com.cc.exception.collect.CollectNotFoundException;
import br.com.cc.repository.ChatRepository;
import br.com.cc.repository.CollectRepository;
import br.com.cc.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ChatServiceImpl implements ChatService {
    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private CollectRepository collectRepository;

    @Override
    public ChatDTO getOrCreateChatByCollectId(Long collectId) {
        Optional<Chat> chatOptional = chatRepository.findByCollectId(collectId);

        if (chatOptional.isPresent()) {
            return convertToDTO(chatOptional.get());
        } else {
            Collect collect = collectRepository.findById(collectId)
                    .orElseThrow(() -> new CollectNotFoundException("Essa coleta não foi encontrada"));

            Chat newChat = new Chat();
            newChat.setCollect(collect);

            newChat = chatRepository.save(newChat);

            return convertToDTO(newChat);
        }
    }

    private ChatDTO convertToDTO(Chat chat) {
        ChatDTO chatDTO = new ChatDTO();
        chatDTO.setChatId(chat.getId());
        chatDTO.setCollectId(chat.getCollect().getId());
        return chatDTO;
    }
}