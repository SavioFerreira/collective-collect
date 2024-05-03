package br.com.cc.enums;

import lombok.Getter;

@Getter
public enum WasteType {
    PLASTICO("Plástico"),
    VIDRO("Vidro"),
    METAL("Metal"),
    MADEIRA("Madeira"),
    ORGANICO("Orgânico"),
    ELETRONICO("Eletrônico"),
    PAPEL("Papel/Papelão"),
    PERIGOSO("Perigoso"),
    ENTULHO("Entulho"),
    INDEFINIDO("Indefinido");

    private final String typeDescription;

    WasteType(String description) {
        this.typeDescription = description;
    }

}