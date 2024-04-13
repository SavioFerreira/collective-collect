package br.com.cc.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Artifact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    private String locale;

    public Artifact() {

    }

    public Artifact(Long id, String title, String description, String locale) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.locale = locale;
    }
}
