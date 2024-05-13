package br.com.cc.entity;

import br.com.cc.enums.Status;
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
	@Enumerated(EnumType.STRING)
	private Status status;
	@CreationTimestamp
	private LocalDateTime date;
	private String collectImage;
	private boolean teamCollect;

	@Embedded
	private WasteInfo wasteInfo;
	@ManyToOne
	@JoinColumn
	@JsonIgnore
	private Complaint complaint;
	@ManyToMany
	@JoinTable
	private Set<User> collaborators = new HashSet<>();
}