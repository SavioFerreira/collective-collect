package br.com.cc.dto.auth;

import br.com.cc.dto.UserDTO;

public record LoginResponseDto(UserDTO user, String token) {
    
}
