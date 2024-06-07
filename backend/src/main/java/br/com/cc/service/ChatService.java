package br.com.cc.service;

import br.com.cc.entity.Chat;
import br.com.cc.entity.Collect;

import java.util.Optional;

public interface ChatService {

    Chat create(Collect collect);

    Optional<Chat> findByCollectId(Long id);
}
