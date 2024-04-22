package br.com.cc.controller;

import br.com.cc.dto.ComplaintDTO;
import br.com.cc.dto.UserDTO;import br.com.cc.entity.Complaint;
import br.com.cc.entity.User;
import br.com.cc.entity.WasteInfo;
import br.com.cc.service.impl.ComplaintServiceImpl;
import br.com.cc.service.impl.UserServiceImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/complaint")
public class ComplaintController {

	@Autowired
	private ComplaintServiceImpl complaintServiceImpl;

	@Autowired
	private UserServiceImpl userServiceImpl;

	@GetMapping
	public List<ComplaintDTO> findAll() {
		return complaintServiceImpl.findAll().stream()
				.map(this::convertToDTO)
				.collect(Collectors.toList());
	}

	@GetMapping("/{id}")
	public ResponseEntity<ComplaintDTO> findById(@PathVariable Long id) {
		return complaintServiceImpl.findById(id)
				.map(this::convertToDTO)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@PostMapping
	public ResponseEntity<ComplaintDTO> create(@Valid @RequestBody ComplaintDTO complaintDto) {
		Complaint complaint = convertToEntity(complaintDto);
		Complaint saved = complaintServiceImpl.create(complaint);
		return ResponseEntity.ok(convertToDTO(saved));
	}

	@PutMapping("/{id}")
	public ResponseEntity<ComplaintDTO> updateById(@PathVariable Long id, @RequestBody ComplaintDTO complaintDto) {
		Complaint updated = complaintServiceImpl.updateById(id, convertToEntity(complaintDto));
		return updated != null ? ResponseEntity.ok(convertToDTO(updated)) : ResponseEntity.notFound().build();
	}


	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteById(@PathVariable Long id) {
		boolean deleted = complaintServiceImpl.deleteById(id);
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

		User author = userServiceImpl.findById(dto.getAuthor().getId()).orElse(null);
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