package br.com.cc.controller;
import br.com.cc.dto.UserDTO;
import br.com.cc.exception.user.InvalidUserCreationException;
import br.com.cc.exception.user.InvalidUserEmailException;
import br.com.cc.exception.user.InvalidUserEmailPasswordException;
import br.com.cc.exception.user.UserNotFoundException;
import br.com.cc.infra.AppError;
import br.com.cc.mapper.UserMapperService;
import br.com.cc.config.security.TokenService;
import br.com.cc.entity.User;
import br.com.cc.dto.auth.AuthenticationDto;
import br.com.cc.dto.auth.LoginResponseDto;
import br.com.cc.dto.auth.RegisterDto;
import br.com.cc.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;

@RestController
@RequestMapping("auth")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserRepository repository;
    @Autowired
    private TokenService tokenService;

    @Autowired
    UserMapperService userMapperService;

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Valid AuthenticationDto data) {
        User existUser = (User) repository.findByEmail(data.email());

        if (existUser == null) {
            throw new UserNotFoundException();
        }

        try {
            var userEmailPassword = new UsernamePasswordAuthenticationToken(data.email(), data.password());
            var auth = authenticationManager.authenticate(userEmailPassword);
            var token = tokenService.generateToken((User) auth.getPrincipal());

            UserDTO userDTO = userMapperService.convertUserToDTO(existUser);
            return ResponseEntity.ok(new LoginResponseDto(userDTO, token));
        } catch (AuthenticationException e) {
            throw new InvalidUserEmailPasswordException();
        }
    }


    @PostMapping("/register")
    public ResponseEntity register(@RequestBody @Valid RegisterDto data) {
        User existUser = (User) repository.findByEmail(data.email());

        if (existUser != null) {
            throw new InvalidUserEmailException();
        }

        String encryptedPassword = new BCryptPasswordEncoder().encode(data.password());
        User newUser = new User(data.name().toLowerCase(), encryptedPassword, data.email().toLowerCase(), data.role());

        try {
            repository.save(newUser);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            throw new InvalidUserCreationException("Não foi possível criar esse Usuário!");
        }
    }
}
