package br.com.cc.service;
import br.com.cc.entity.User;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface UserService {

    User create(User user);
    List<User> findAll();
    Optional<User> findById(Long id);

    //User updateById(Long id, User user);
    User updateById(Long id, Map<String, Object> updates);
    boolean deleteById(Long id);

}
