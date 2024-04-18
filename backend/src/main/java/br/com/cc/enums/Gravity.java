package br.com.cc.enums;

public enum Gravity {
    BAIXO("Baixo"),
    MEDIO("Médio"),
    ALTO("Alto"),
    CRITICO("Crítico");

    private final String description;

    Gravity(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}