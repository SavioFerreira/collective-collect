package br.com.cc.service.impl;

import br.com.cc.dto.ChatDTO;
import br.com.cc.entity.Chat;
import br.com.cc.entity.Collect;
import br.com.cc.entity.Message;
import br.com.cc.exception.collect.CollectNotFoundException;
import br.com.cc.repository.ChatRepository;
import br.com.cc.repository.CollectRepository;
import br.com.cc.repository.MessageRepository;
import br.com.cc.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatRepository chatRepository;
    private final CollectRepository collectRepository;
    private final MessageRepository messageRepository;

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

    @Override
    @Transactional
    public void deleteByCollectId(Long collectId) {
        Optional<Chat> chat = chatRepository.findByCollectId(collectId);
        if(chat.isPresent()) {
            List<Message> messages = messageRepository.findByChatId(chat.get().getId());
            if(!messages.isEmpty()){
                messageRepository.deleteAll(messages);
            }
            chatRepository.delete(chat.get());
        }
    }

    private ChatDTO convertToDTO(Chat chat) {
        ChatDTO chatDTO = new ChatDTO();
        chatDTO.setChatId(chat.getId());
        chatDTO.setCollectId(chat.getCollect().getId());
        return chatDTO;
    }
}