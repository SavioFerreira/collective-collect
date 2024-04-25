package br.com.cc.dto.auth;

import br.com.cc.enums.AuthUserRole;
import jakarta.validation.constraints.NotNull;

public record RegisterDto(@NotNull String name,@NotNull String password, @NotNull String email, @NotNull AuthUserRole role) {

}
