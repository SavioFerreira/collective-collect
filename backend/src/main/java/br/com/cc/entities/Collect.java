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
	private Long id;
	private String status;
	private String type;
	private String gravity;
	private LocalDateTime data;

	@OneToOne
	private Artifact artifact;

	public Collect() {
		
	}

	public Collect(Long id, String title, String description,  String local) {
		id = artifact.getId();
		title = artifact.getTitle();
		description = artifact.getDescription();
		local = artifact.getLocale();
	}

	public Long getId() {
		return artifact.getId();
	}

	public void setId(Long id) {
		this.id = artifact.getId();
	}
}
