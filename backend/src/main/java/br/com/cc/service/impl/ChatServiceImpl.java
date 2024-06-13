package br.com.cc.service.impl;

import br.com.cc.dto.ChatDTO;
import br.com.cc.entity.Chat;
import br.com.cc.entity.Collect;
import br.com.cc.entity.User;
import br.com.cc.enums.AuthUserRole;
import br.com.cc.exception.collect.CollectNotFoundException;
import br.com.cc.exception.user.InvalidUserAdminDeletionException;
import br.com.cc.repository.ChatRepository;
import br.com.cc.repository.CollectRepository;
import br.com.cc.repository.UserRepository;
import br.com.cc.service.ChatService;
import br.com.cc.service.UserService;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ChatServiceImpl implements ChatService {
    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private CollectRepository collectRepository;

    @Override
    public ChatDTO createChatForCollect(Long collectId) {
        Collect collect = collectRepository.findById(collectId)
                .orElseThrow(() -> new CollectNotFoundException("Essa coleta não foi encontrada"));

        Chat chat = new Chat();
        chat.setCollect(collect);
        chat = chatRepository.save(chat);

        ChatDTO chatDTO = new ChatDTO();
        chatDTO.setChatId(chat.getId());
        chatDTO.setCollectId(collect.getId());
        return chatDTO;
    }

    @Override
    public ChatDTO  getChatByCollectId(Long collectId) {
        Chat chat = chatRepository.findByCollectId(collectId)
                .orElseThrow(() -> new IllegalStateException("Chat não encontrado"));

        ChatDTO chatDTO = new ChatDTO();
        chatDTO.setChatId(chat.getId());
        chatDTO.setCollectId(chat.getCollect().getId());
        return chatDTO;
    }
}