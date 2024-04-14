package br.com.cc.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.cc.entities.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long>{

}
