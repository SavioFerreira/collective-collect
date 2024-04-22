package br.com.cc.models;

import br.com.cc.dto.ComplaintDTO;
import br.com.cc.entities.Complaint;
import br.com.cc.entities.User;
import br.com.cc.entities.WasteInfo;
import br.com.cc.services.UserService;

public interface ComplaintModels extends UserModels{

    default ComplaintDTO convertComplaintToDTO(Complaint complaint) {
        ComplaintDTO dto = new ComplaintDTO();

        dto.setId(complaint.getId());
        dto.setStatus(complaint.getStatus());
        dto.setDate(complaint.getDate());
        dto.setImage(complaint.getWasteInfo().getImage());
        dto.setType(complaint.getWasteInfo().getWasteType());
        dto.setGravity(complaint.getWasteInfo().getGravity());
        dto.setTitle(complaint.getWasteInfo().getTitle());
        dto.setDescription(complaint.getWasteInfo().getDescription());
        dto.setLocale(complaint.getWasteInfo().getLocale());

        dto.setAuthor(convertUserToDTO(complaint.getAuthor()));
        return dto;
    }

    default Complaint convertComplaintDtoToEntity(ComplaintDTO dto) {
        Complaint complaint = new Complaint();
        complaint.setId(dto.getId());
        complaint.setStatus(dto.getStatus());
        complaint.setDate(dto.getDate());
        User author = userService.findById(dto.getAuthor().getId()).orElse(null);
        complaint.setAuthor(author);

        WasteInfo wasteInfo = new WasteInfo();
        wasteInfo.setWasteType(dto.getType());
        wasteInfo.setGravity(dto.getGravity());
        wasteInfo.setTitle(dto.getTitle());
        wasteInfo.setDescription(dto.getDescription());
        wasteInfo.setLocale(dto.getLocale());
        wasteInfo.setImage(dto.getImage());
        complaint.setWasteInfo(wasteInfo);

        return complaint;
    }

}
