package br.com.cc.dto;

import br.com.cc.enums.AuthUserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;

    @NotEmpty(message = "O nome não pode estar vazio.")
    private String name;

    @Email(message = "Email deve ser válido.")
    private String email;

    private AuthUserRole role;
}