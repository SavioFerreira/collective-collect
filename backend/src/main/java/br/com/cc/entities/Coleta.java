package br.com.cc.entities;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
public class Coleta {
	
	private Long id;
	private String descricaoColeta;
	private String statusColeta;
	private String tipoColeta;
	private String gravidadeDenun;
	private String localDenun;
	private LocalDateTime dateTimeColeta;
	
	private Denuncia denuncia;
	
	public Coleta() {
		
	}


}
