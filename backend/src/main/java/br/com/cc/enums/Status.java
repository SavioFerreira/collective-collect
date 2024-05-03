package br.com.cc.enums;

import lombok.Getter;

@Getter
public enum Status {

    PENDENTE("Pendente"),
    APROVADO("Aprovado"),
    REJEITADO("Rejeitado"),
    EM_ANALISE("Em Análise"),
    OCORRENDO("Ocorrendo"),
    DISPONIVEL("Disponível");

    private final String description;

    Status(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}