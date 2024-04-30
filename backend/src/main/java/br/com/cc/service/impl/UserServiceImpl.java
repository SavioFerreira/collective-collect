package br.com.cc.service.impl;

import br.com.cc.entity.User;
import br.com.cc.entity.Collect;
import br.com.cc.entity.Complaint;
import br.com.cc.enums.AuthUserRole;
import br.com.cc.exception.AppError;
import br.com.cc.factory.UserActionFactory;
import br.com.cc.mapper.UserMapperService;
import br.com.cc.repository.UserRepository;
import br.com.cc.service.UserService;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
            AppError appError = new AppError("Este email já está cadastrado");
            throw new Error(appError.getMessage());
        }

        String encryptedPassword = new BCryptPasswordEncoder().encode(user.getPassword());
        user.setPassword(encryptedPassword);
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
        Optional<User> user = userRepository.findById(id);

        if (user.isPresent()) {
            User currentUser = user.get();
            if (currentUser.getRole().equals(AuthUserRole.ADMIN)) {
                AppError appError = new AppError("O usuário " + currentUser.getName() + "é administrador e não pode ser removido");
                throw new Error(appError.getMessage());
            } else {
                userRepository.deleteById(id);
                return true;
            }
        }
        return false;
    }

//    @Override
//    public User updateById(Long id, User updateUser) {
//        if (userRepository.existsById(id)) {
//            updateUser.setId(id);
//            return userRepository.save(updateUser);
//        }
//        return null;
//    }


    @Override
    public User updateById(Long id, Map<String, Object> updates) {
        Optional<User> existingUserOpt = userRepository.findById(id);
        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();
            BeanWrapper wrapper = new BeanWrapperImpl(existingUser);

            updates.forEach((key, value) -> {
                if (wrapper.isWritableProperty(key)) {
                    wrapper.setPropertyValue(key, value);
                }
            });

            return userRepository.save(existingUser);
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
