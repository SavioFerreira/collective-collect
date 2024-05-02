package br.com.cc.enums;

public enum Status {
    DISPONIVEL("Disponível"),
    PENDENTE("Pendente"),
    APROVADO("Aprovado"),
    REJEITADO("Rejeitado"),
    EM_ANALISE("Em Análise");

    private final String description;

    Status(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}