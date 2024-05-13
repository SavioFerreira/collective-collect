package br.com.cc.entity;

import br.com.cc.enums.Status;
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

	@Enumerated(EnumType.STRING)
	private Status status;

	@CreationTimestamp
	private LocalDateTime complaintDate;

	@Embedded
	private WasteInfo wasteInfo;

	@ManyToOne
	@NotNull
	@JoinColumn
	private User author;

	@OneToOne
	@JoinColumn
	@JsonIgnore
	private Collect collect;
}
