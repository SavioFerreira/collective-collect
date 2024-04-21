package br.com.cc.entities;

import br.com.cc.security.rules.Rules;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotEmpty(message = "O nome não pode estar vazio.")
	private String name;

	@Email(message = "Email deve ser válido.")
	@Column(unique = true)
	private String email;
	private String password;
	private String avatar;
	private boolean isAdministrator;

	@ManyToMany
	private List<Rules> rules;

	public User(Long id, String name, String email, String avatar) {

	}


}
