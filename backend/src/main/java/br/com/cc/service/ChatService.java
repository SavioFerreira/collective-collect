package br.com.cc.service;

import br.com.cc.dto.ChatDTO;

public interface ChatService {

    ChatDTO createChatForCollect(Long collectId);

    ChatDTO getChatByCollectId(Long id);
}
