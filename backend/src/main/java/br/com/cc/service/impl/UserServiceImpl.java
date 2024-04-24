package br.com.cc.service.impl;

import br.com.cc.entity.User;
import br.com.cc.entity.Collect;
import br.com.cc.entity.Complaint;
import br.com.cc.factory.UserActionFactory;
import br.com.cc.repository.UserRepository;
import br.com.cc.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserRepository userRepository;


    @Override
    public User create(User user) {
        User existUser = (User) userRepository.findByName(user.getName());
        String encryptedPassword;

        if(existUser != null) {
            throw new Error("Este usuário já existe");
        }

        user.setPassword(encryptedPassword = new BCryptPasswordEncoder().encode(user.getPassword()));
        User createdUser = userRepository.save(user);
        return createdUser;
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
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public User updateById(Long id, User updateUser) {
        if (userRepository.existsById(id)) {
            updateUser.setId(id);
            return userRepository.save(updateUser);
        }
        return null;
    }

    public Complaint registerComplaint(User user) {
        Complaint complaint = UserActionFactory.createComplaint(user);
        // TODO - Salvar a reclamação no banco de dados aqui
        return complaint;
    }

    public Collect startCollect(User user) {
        Collect collect = UserActionFactory.createCollect(user);
        // TODO - Salvar a coleta no banco de dados aqui
        return collect;
    }
}
