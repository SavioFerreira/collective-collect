package br.com.cc.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.cc.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long>{
    User findByName(String userName);

    @Query("SELECT u FROM User u JOIN FETCH u.roles WHERE u.name = :name")
    User findByNameFetchRoles(@Param("name")String name);
}
