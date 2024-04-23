package br.com.cc.controller;

import br.com.cc.dto.ComplaintDTO;
import br.com.cc.dto.UserDTO;
import br.com.cc.entity.Complaint;
import br.com.cc.entity.User;
import br.com.cc.entity.WasteInfo;
import br.com.cc.service.ComplaintService;
import br.com.cc.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/complaint")
public class ComplaintController {

	@Autowired
	private ComplaintService complaintService;

	@Autowired
	private UserService userService;

	@PreAuthorize("hasRole('COMPLAINT_SELECT')")
	@GetMapping
	public List<ComplaintDTO> findAll() {
		return complaintService.findAll().stream()
				.map(this::convertToDTO)
				.collect(Collectors.toList());
	}

	@PreAuthorize("hasRole('COMPLAINT_SELECT')")
	@GetMapping("/{id}")
	public ResponseEntity<ComplaintDTO> findById(@PathVariable Long id) {
		return complaintService.findById(id)
				.map(this::convertToDTO)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@PreAuthorize("hasRole('COMPLAINT_CREATE')")
	@PostMapping
	public ResponseEntity<ComplaintDTO> create(@RequestBody ComplaintDTO complaintDto) {
		Complaint complaint = convertToEntity(complaintDto);
		Complaint saved = complaintService.create(complaint);
		return ResponseEntity.ok(convertToDTO(saved));
	}

	@PreAuthorize("hasRole('COMPLAINT_UPDATE')")
	@PutMapping("/{id}")
	public ResponseEntity<ComplaintDTO> updateById(@PathVariable Long id, @RequestBody ComplaintDTO complaintDto) {
		Complaint updated = complaintService.updateById(id, convertToEntity(complaintDto));
		return updated != null ? ResponseEntity.ok(convertToDTO(updated)) : ResponseEntity.notFound().build();
	}

	@PreAuthorize("hasRole('COMPLAINT_DELETE')")
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteById(@PathVariable Long id) {
		boolean deleted = complaintService.deleteById(id);
		return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
	}

	private ComplaintDTO convertToDTO(Complaint complaint) {
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