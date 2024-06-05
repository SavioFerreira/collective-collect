package br.com.cc.service.impl;

import br.com.cc.entity.User;
import br.com.cc.enums.AuthUserRole;
import br.com.cc.exception.user.InvalidUserAdminDeletionException;
import br.com.cc.repository.UserRepository;
import br.com.cc.service.UserService;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserRepository userRepository;

    @Override
    public User create(User user) {
        User existUser = (User) userRepository.findByEmail(user.getEmail());

        if(existUser != null) {
            throw new RuntimeException();
        }

        String encryptedPassword = new BCryptPasswordEncoder().encode(user.getPassword());
        User newUser = new User(user.getName(), encryptedPassword, user.getEmail(), user.getRole());
        newUser.setId(user.getId());
        return userRepository.save(newUser);
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public boolean deleteById(Long id) {
        Optional<User> user = userRepository.findById(id);

        if (user.isPresent()) {
            User currentUser = user.get();
            if (currentUser.getRole().equals(AuthUserRole.ADMIN)) {
                throw new InvalidUserAdminDeletionException();
            } else {
                userRepository.deleteById(id);
                return true;
            }
        }
        return false;
    }

    @Override
    public User updateById(Long id, Map<String, Object> updates) {
        Optional<User> existingUserOpt = userRepository.findById(id);
           if (existingUserOpt.isEmpty()) {
            return null;
        }

        User existingUser = existingUserOpt.get();
        BeanWrapper wrapper = new BeanWrapperImpl(existingUser);

        updates.forEach((key, value) -> {
            if ("password".equals(key)) {
                String encryptedPassword = new BCryptPasswordEncoder().encode((String) value);
                wrapper.setPropertyValue(key, encryptedPassword);
            } else if (wrapper.isWritableProperty(key)) {
                wrapper.setPropertyValue(key, value);
            }
        });

        return userRepository.save(existingUser);
    }

}
