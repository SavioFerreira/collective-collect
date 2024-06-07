package br.com.cc.service;

import br.com.cc.entity.Chat;
import br.com.cc.entity.Message;
import br.com.cc.entity.User;

import java.util.Optional;

public interface MessageService {

    Message sendMessage(Chat chat, User user, String content);

    Optional<Message> findByChatId(Long id);
}
