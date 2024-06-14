package br.com.cc.repository;

import br.com.cc.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long>{
    Optional<Chat> findByCollectId(Long collectId);
}
