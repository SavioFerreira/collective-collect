package br.com.cc.models;

import br.com.cc.dto.UserDTO;
import br.com.cc.entities.User;
import br.com.cc.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;


public interface UserModels {

    @Autowired
    UserService userService = new UserService();

    default UserDTO convertUserToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        return dto;
    }

    default User convertUserToEntity(UserDTO dto) {
        User user = new User();
        user.setId(dto.getId());
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        return user;
    }
}
