package br.com.cc.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
public class Complaint {

	@Id
	private Long id;
	private String status;
	private String type;
	private String gravity;


	private LocalDateTime date;
	private String image;

	@OneToOne
	private Artifact artifact;

	@OneToOne
	private Collect collect;
	
	public Complaint() {
		
	}

	public Complaint(Long id, Long artifactId,String title, String description, String locale,  String status, String type, String gravity, LocalDateTime date, String image) {
		this.id = id;
		artifactId = artifact.getId();
		title = artifact.getTitle();
		description = artifact.getDescription();
		locale = artifact.getLocale();
		this.status = status;
		this.type = type;
		this.gravity = gravity;
		this.date = date;
		this.image = image;

	}

	public Collect collect (Collect collect){
		return collect;
	}

}
