package br.com.cc.service;

import br.com.cc.entity.Chat;
import br.com.cc.entity.Message;
import br.com.cc.entity.User;

public interface MessageService {

    Message sendMessage(Chat chat, User user, String content);
}
