package br.com.cc.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

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
	private LocalDateTime date;

	@OneToOne
	private Artifact artifact;

	public Collect() {
		
	}

	public Collect(Long id, Long artifactId, String title, String description,  String local) {
		this.id = id;
		artifactId = artifact.getId();
		title = artifact.getTitle();
		description = artifact.getDescription();
		local = artifact.getLocale();
	}

}
