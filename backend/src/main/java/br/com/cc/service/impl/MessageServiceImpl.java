package br.com.cc.service.impl;

import br.com.cc.dto.MessageDTO;
import br.com.cc.entity.*;
import br.com.cc.repository.ChatRepository;
import br.com.cc.repository.MessageRepository;
import br.com.cc.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

import java.util.stream.Collectors;

@Service
public class MessageServiceImpl implements MessageService {
    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ChatRepository chatRepository;

    @Override
    public MessageDTO sendMessage(Long chatId, String content) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new IllegalStateException("Chat não encontrado"));
        Message message = new Message();
        message.setChat(chat);
        message.setUser(user);
        message.setContent(content);
        message.setTimestamp(LocalDateTime.now());
        message = messageRepository.save(message);

        return convertToDTO(message);
    }

    @Override
    public List<MessageDTO> getMessagesByChatId(Long chatId) {
        List<Message> messages = messageRepository.findByChatId(chatId);
        return messages.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private MessageDTO convertToDTO(Message message) {
        MessageDTO messageDTO = new MessageDTO();
        messageDTO.setId(message.getId());
        messageDTO.setChatId(message.getChat().getId());
        messageDTO.setUserName(message.getUser().getName());
        messageDTO.setContent(message.getContent());
        messageDTO.setTimestamp(message.getTimestamp());
        messageDTO.setRole(message.getUser().getRole());
        return messageDTO;
    }
}