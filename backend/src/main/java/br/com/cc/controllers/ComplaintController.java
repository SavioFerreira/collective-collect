package br.com.cc.controllers;

import br.com.cc.dto.ComplaintDTO;
import br.com.cc.dto.UserDTO;import br.com.cc.entities.Complaint;
import br.com.cc.entities.User;
import br.com.cc.services.ComplaintService;
import br.com.cc.services.UserService;
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

	@Autowired
	private UserService userService;

	@GetMapping
	public List<ComplaintDTO> findAll() {
		return complaintService.findAll().stream()
				.map(this::convertToDTO)
				.collect(Collectors.toList());
	}

	@GetMapping("/{id}")
	public ResponseEntity<ComplaintDTO> findById(@PathVariable Long id) {
		return complaintService.findById(id)
				.map(this::convertToDTO)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@PostMapping
	public ResponseEntity<ComplaintDTO> save(@RequestBody ComplaintDTO complaintDto) {
		Complaint complaint = convertToEntity(complaintDto);
		Complaint saved = complaintService.save(complaint);
		return ResponseEntity.ok(convertToDTO(saved));
	}

	@PutMapping("/{id}")
	public ResponseEntity<ComplaintDTO> updateById(@PathVariable Long id, @RequestBody ComplaintDTO complaintDto) {
		Complaint complaint = convertToEntity(complaintDto);
		complaint.setId(id); // Ensure the complaint has the correct ID
		Complaint updated = complaintService.updateById(id, complaint);
		return updated != null ? ResponseEntity.ok(convertToDTO(updated)) : ResponseEntity.notFound().build();
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteById(@PathVariable Long id) {
		boolean deleted = complaintService.deleteById(id);
		return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
	}

	private ComplaintDTO convertToDTO(Complaint complaint) {
		ComplaintDTO dto = new ComplaintDTO();
		dto.setId(complaint.getId());
		dto.setStatus(complaint.getStatus());
		dto.setType(complaint.getType());
		dto.setGravity(complaint.getGravity());
		dto.setDate(complaint.getDate());
		dto.setImage(complaint.getImage());
		dto.setTitle(complaint.getTitle());
		dto.setDescription(complaint.getDescription());
		dto.setLocale(complaint.getLocale());
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
		complaint.setId(dto.getId());
		complaint.setStatus(dto.getStatus());
		complaint.setType(dto.getType());
		complaint.setGravity(dto.getGravity());
		complaint.setDate(dto.getDate());
		complaint.setImage(dto.getImage());
		complaint.setTitle(dto.getTitle());
		complaint.setDescription(dto.getDescription());
		complaint.setLocale(dto.getLocale());

		User author = userService.findById(dto.getAuthor().getId()).orElse(null);
		complaint.setAuthor(author);

		return complaint;
	}
}