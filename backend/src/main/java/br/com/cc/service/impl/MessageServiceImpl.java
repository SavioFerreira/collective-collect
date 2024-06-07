package br.com.cc.service.impl;

import br.com.cc.entity.Chat;
import br.com.cc.entity.Message;
import br.com.cc.entity.User;
import br.com.cc.repository.MessageRepository;
import br.com.cc.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class MessageServiceImpl implements MessageService {

    @Autowired
    MessageRepository messageRepository;

    @Override
    public Message sendMessage(Chat chat, User user, String content) {
        Message message = new Message();
        message.setChat(chat);
        message.setUser(user);
        message.setContent(content);
        message.setTimestamp(LocalDateTime.now());
        return messageRepository.save(message);
    }

    @Override
    public Optional<Message> findByChatId(Long id) {
        return messageRepository.findById(id);
    }
}
