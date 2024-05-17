package br.com.cc.entity;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Embeddable
public class Locale {

    private String address;
    private double latitude;
    private double longitude;

}
