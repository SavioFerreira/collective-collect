package br.com.cc.mapper;
import br.com.cc.entity.User;
import br.com.cc.dto.ComplaintDTO;
import br.com.cc.entity.Complaint;
import br.com.cc.entity.WasteInfo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ComplaintMapperService  {

    @Autowired
    private UserMapperService userMapperService;

    public ComplaintDTO convertComplaintToDTO(Complaint complaint) {
        ComplaintDTO dto = new ComplaintDTO();
        dto.setCollectId(complaint.getCollect() != null ? complaint.getCollect().getId() : null);
        dto.setId(complaint.getId());
        dto.setStatus(complaint.getStatus());
        dto.setDate(complaint.getDate());
        dto.setImage(complaint.getWasteInfo().getImage());
        dto.setType(complaint.getWasteInfo().getWasteType());
        dto.setGravity(complaint.getWasteInfo().getGravity());
        dto.setTitle(complaint.getWasteInfo().getTitle());
        dto.setDescription(complaint.getWasteInfo().getDescription());
        dto.setLocale(complaint.getWasteInfo().getLocale());

        dto.setAuthor(userMapperService.convertUserToDTO(complaint.getAuthor()));
        return dto;
    }

    public Complaint convertComplaintDtoToEntity(ComplaintDTO dto) {
        Complaint complaint = new Complaint();
        complaint.setId(dto.getId());
        complaint.setStatus(dto.getStatus());
        complaint.setDate(dto.getDate());
        User author = userMapperService.userService.findById(dto.getAuthor().getId()).orElse(null);
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
