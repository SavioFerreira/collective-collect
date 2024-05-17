package br.com.cc.entity;

import br.com.cc.enums.Gravity;
import br.com.cc.enums.WasteType;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

@Data
@Embeddable
public class WasteInfo {

    private String title;
    private String description;

    @Embedded
    private Locale locale;
    private String image;
    @Enumerated(EnumType.STRING)
    private Gravity gravity;
    @Enumerated(EnumType.STRING)
    private WasteType wasteType;
}
