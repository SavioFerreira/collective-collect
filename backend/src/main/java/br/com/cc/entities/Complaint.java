package br.com.cc.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Complaint {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String status;
	private String type;
	private String gravity;


	@CreationTimestamp
	private LocalDateTime date;
	private String image;

	String title;
	String description;
	String locale;


	@ManyToOne
	@NotNull
	@JoinColumn(name = "author_id")
	private User author;

	@OneToOne
	@JoinColumn(name = "collect_id")
	@JsonIgnore
	private Collect collect;

}
