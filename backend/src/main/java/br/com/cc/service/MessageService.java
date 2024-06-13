package br.com.cc.service;

import br.com.cc.dto.MessageDTO;
import java.util.List;

public interface MessageService {

    MessageDTO sendMessage(Long chatId, String content);

    List<MessageDTO> getMessagesByChatId(Long chatId);
}
