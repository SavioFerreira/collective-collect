package br.com.cc.service.impl;

import br.com.cc.entity.User;
import br.com.cc.repository.UserRepository;
import br.com.cc.service.UserServ;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServImpl implements UserServ {

    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Autowired
    UserRepository userRepository;

    @Override
    public User create(User user) {
        User existUser = userRepository.findByName(user.getName());

        if(existUser != null) {
            throw new Error("Este usuário já existe");
        }

        user.setPassword(passwordEncoder().encode(user.getPassword()));
        User createdUser = userRepository.save(user);
        return createdUser;
    }
}
