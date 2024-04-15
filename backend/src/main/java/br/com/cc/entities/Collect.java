package br.com.cc.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.jetbrains.annotations.NotNull;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;


@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Entity
public class Collect {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String status;
	private String type;
	private String gravity;

	@CreationTimestamp
	private LocalDateTime date;
	private String image;

	private String title;
	private String description;
	private String locale;

	private Long id_complaint;

	@ManyToMany
	@JoinTable(
			name = "collect_collaborator",
			joinColumns = @JoinColumn(name = "collect_id"),
			inverseJoinColumns = @JoinColumn(name = "user_id")
	)
	private Set<User> collaborators = new HashSet<>();

}
