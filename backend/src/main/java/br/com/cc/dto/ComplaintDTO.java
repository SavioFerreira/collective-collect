package br.com.cc.dto;

import java.time.LocalDateTime;

public class ComplaintDTO {
    private Long id;
    private String status;
    private String type;
    private String gravity;
    private LocalDateTime date;
    private String image;
    private String title;
    private String description;
    private String locale;
    private UserDTO author; // Usar UserDTO aqui

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getGravity() { return gravity; }
    public void setGravity(String gravity) { this.gravity = gravity; }
    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getLocale() { return locale; }
    public void setLocale(String locale) { this.locale = locale; }
    public UserDTO getAuthor() { return author; }
    public void setAuthor(UserDTO author) { this.author = author; }
}