package br.com.cc.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
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

	@ManyToOne
	@JoinColumn(name = "complaint_id")
	@JsonIgnore
	private Complaint complaint;

	@ManyToMany
	@JoinTable(
			name = "collect_collaborator",
			joinColumns = @JoinColumn(name = "collect_id"),
			inverseJoinColumns = @JoinColumn(name = "user_id")
	)
	private Set<User> collaborators = new HashSet<>();

}