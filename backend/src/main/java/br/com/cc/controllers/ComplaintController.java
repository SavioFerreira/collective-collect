package br.com.cc.controllers;

import br.com.cc.dto.ComplaintDTO;
import br.com.cc.dto.UserDTO;
import br.com.cc.entities.Complaint;
import br.com.cc.entities.User;
import br.com.cc.services.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/complaints")
public class ComplaintController {

	@Autowired
	private ComplaintService complaintService;

	@GetMapping
	public List<ComplaintDTO> findAll() {
		return complaintService.findAll().stream()
				.map(this::convertToDTO)
				.collect(Collectors.toList());
	}

	@PostMapping
	public ResponseEntity<ComplaintDTO> save(@RequestBody ComplaintDTO complaintDto) {
		Complaint complaint = convertToEntity(complaintDto);
		Complaint saved = complaintService.save(complaint);
		return ResponseEntity.ok(convertToDTO(saved));
	}

	private ComplaintDTO convertToDTO(Complaint complaint) {
		ComplaintDTO dto = new ComplaintDTO();
		dto.setId(complaint.getId());

		dto.setAuthor(convertUserToDTO(complaint.getAuthor()));
		return dto;
	}

	private UserDTO convertUserToDTO(User user) {
		UserDTO dto = new UserDTO();
		dto.setId(user.getId());
		dto.setName(user.getName());
		dto.setEmail(user.getEmail());
		return dto;
	}

	private Complaint convertToEntity(ComplaintDTO dto) {
		Complaint complaint = new Complaint();
		return complaint;
	}
}