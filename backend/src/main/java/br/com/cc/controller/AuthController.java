package br.com.cc.controller;
import br.com.cc.enums.AuthUserRole;
import br.com.cc.exception.AppError;
import br.com.cc.security.TokenService;
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

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Valid AuthenticationDto data){
        try {
            User existUser = (User) repository.findByEmail(data.email());
            if (existUser == null) {
                AppError appError = new AppError("error", "E-mail e/ou senha incorreta.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(appError);
            }

            var userEmailPassword = new UsernamePasswordAuthenticationToken(data.email(), data.password());
            var auth = this.authenticationManager.authenticate(userEmailPassword);

            var token = tokenService.generateToken((User) auth.getPrincipal());

            return ResponseEntity.ok(new LoginResponseDto(token));
        } catch (AuthenticationException e) {
            AppError appError = new AppError("error", "E-mail e/ou senha incorreta.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(appError);
        } catch (Exception e) {
            AppError appError = new AppError("error", "Erro interno no servidor.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(appError);
        }
    }

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody @Valid RegisterDto data){
        User existUser = (User) repository.findByEmail(data.email());

        if(existUser != null) {
            AppError appError = new AppError("error", "Este email já está sendo utilizado!");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(appError);
        }

        String encryptedPassword = new BCryptPasswordEncoder().encode(data.password());
        User newUser = new User(data.name(), encryptedPassword, data.email().toLowerCase(), data.role());

        if(newUser.getRole() == null) {
            newUser.setRole(AuthUserRole.USER);
        }

        this.repository.save(newUser);

        return ResponseEntity.ok().build();
    }
}
