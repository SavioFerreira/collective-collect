package br.com.cc.service.impl;

import br.com.cc.entity.Chat;
import br.com.cc.entity.Collect;
import br.com.cc.entity.User;
import br.com.cc.enums.AuthUserRole;
import br.com.cc.exception.user.InvalidUserAdminDeletionException;
import br.com.cc.repository.ChatRepository;
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

    @Override
    public Chat create(Collect collect) {
        Chat chat = new Chat();
        chat.setCollect(collect);
        return chatRepository.save(chat);
    }

    @Override
    public Optional<Chat> findByCollectId(Long id) {
        return chatRepository.findById(id);
    }
}
