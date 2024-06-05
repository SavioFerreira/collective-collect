package br.com.cc.service.impl;

import br.com.cc.dto.UserDTO;
import br.com.cc.entity.Chat;
import br.com.cc.entity.Message;
import br.com.cc.entity.User;
import br.com.cc.enums.AuthUserRole;
import br.com.cc.exception.user.InvalidUserAdminDeletionException;
import br.com.cc.repository.MessageRepository;
import br.com.cc.repository.UserRepository;
import br.com.cc.service.MessageService;
import br.com.cc.service.UserService;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.beans.XMLEncoder;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class MessageServiceImpl implements MessageService {

    @Autowired
    MessageRepository messageRepository;

    @Override
    public Message sendMessage(Chat chat, UserDTO user, String content) {
        Message message = new Message();
        message.setChat(chat);
        message.setUser(user);
        message.setContent(content);
        message.setTimestamp(LocalDateTime.now());
        return messageRepository.save(message);
    }
}
