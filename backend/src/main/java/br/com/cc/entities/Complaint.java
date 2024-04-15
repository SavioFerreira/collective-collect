package br.com.cc.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
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
	private User author;

	@OneToOne
	private Collect collect;

}
