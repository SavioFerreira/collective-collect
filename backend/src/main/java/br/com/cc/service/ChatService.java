package br.com.cc.service;

import br.com.cc.entity.Chat;
import br.com.cc.entity.Collect;

public interface ChatService {

    Chat create(Collect collect);

}
