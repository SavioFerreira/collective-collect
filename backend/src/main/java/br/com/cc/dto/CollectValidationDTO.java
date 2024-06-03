package br.com.cc.dto;

import br.com.cc.enums.Status;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CollectValidationDTO {

    private Status status;
    private String message;
}
