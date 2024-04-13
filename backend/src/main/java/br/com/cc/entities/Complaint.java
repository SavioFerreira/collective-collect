package br.com.cc.entities;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
public class Complaint {
	
	private Long id;
	private String status;
	private String type;
	private String gravity;
	
	private LocalDateTime data;
	private String captura;
	
	public Complaint() {
		
	}



}
