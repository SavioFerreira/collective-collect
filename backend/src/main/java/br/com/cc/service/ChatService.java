package br.com.cc.service;

import br.com.cc.dto.ChatDTO;

public interface ChatService {

    ChatDTO getOrCreateChatByCollectId(Long collectId);
    void deleteByCollectId(Long id);

}
