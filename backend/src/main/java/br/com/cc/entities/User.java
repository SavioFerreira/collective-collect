package br.com.cc.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
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


	public Complaint makeComplaint(){
		return new Complaint();
	}

	public Collect makeCollect(){
		return new Collect();
	}

}
