package br.com.cc.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CollectDTO {
    private Long id;
    private String status;
    private String type;
    private String gravity;
    private LocalDateTime date;
    private String image;
    private String title;
    private String description;
    private String locale;
    private Long complaintId;
    private Set<UserDTO> collaborators;
}