package br.com.cc.entities;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
public class Denuncia {
	
	private Long id;
	private String descricaoDenun;
	private String localDenun;
	private String statusDenun;
	private String tipoResiduo;
	private String gravidadeDenun;
	
	private LocalDateTime dateTimeDenun;
	private String capturaDenun;
	private Coleta coleta;
	
	public Denuncia() {
		
	}


}
