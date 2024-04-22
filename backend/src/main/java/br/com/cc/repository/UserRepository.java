package br.com.cc.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.cc.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long>{
    User findByName(String userName);
}
