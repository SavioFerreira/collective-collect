package br.com.cc.enums;

import lombok.Getter;

@Getter
public enum WasteType {
    PLASTICO("Plástico"),
    VIDRO("Vidro"),
    METAL("Metal"),
    MADEIRA("Madeira"),
    ORGANICO("Orgânico"),
    ELETRONICOS("Eletrônicos"),
    PAPEL("Papel/Papelão"),
    PERIGOSOS("Perigosos"),
    CONSTRUCAO("Construção e Demolição"),
    VOLUMOSOS("Volumosos");

    private final String typeDescription;

    WasteType(String description) {
        this.typeDescription = description;
    }

}