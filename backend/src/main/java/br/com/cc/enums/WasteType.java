package br.com.cc.enums;

import lombok.Getter;

@Getter
public enum WasteType {
    PLASTICO("Plástico"),
    VIDRO("Vidro"),
    METAL("Metal"),
    ALVENARIA("Alvenaria"),
    MADEIRA("Madeira"),
    ORGANICO("Orgânico"),
    ELETRONICOS("Eletrônicos"),
    TEXTIL("Têxtil"),
    PAPEL("Papel/Papelão"),
    PERIGOSOS("Perigosos"),
    CONSTRUCAO("Construção e Demolição"),
    VOLUMOSOS("Volumosos");

    private final String typeDescription;

    WasteType(String description) {
        this.typeDescription = description;
    }

}