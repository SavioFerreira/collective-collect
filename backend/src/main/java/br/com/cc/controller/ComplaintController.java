package br.com.cc.controller;
import br.com.cc.dto.ComplaintDTO;
import br.com.cc.entity.Complaint;
import br.com.cc.mapper.ComplaintMapperService;
import br.com.cc.service.ComplaintService;
import br.com.cc.service.ImageStorageService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/complaint")
public class ComplaintController {

	@Autowired
	private ComplaintService complaintService;

	@Autowired
	private ComplaintMapperService complaintMapperService;

	@Autowired
	private ImageStorageService imageStorageService;

	@GetMapping
	public List<ComplaintDTO> findAll() {
		return complaintService.findAll().stream()
				.map(complaintMapperService::convertComplaintToDTO)
				.collect(Collectors.toList());
	}

	@GetMapping("/{id}")
	public ResponseEntity<ComplaintDTO> findById(@PathVariable Long id) {
		return complaintService.findById(id)
				.map(complaintMapperService::convertComplaintToDTO)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@PostMapping(consumes = {"multipart/form-data"})
	public ResponseEntity<ComplaintDTO> create(@RequestParam("complaint") String complaintDtoJson, @RequestParam("image") MultipartFile image) throws IOException {
		ObjectMapper mapper = new ObjectMapper();
		mapper.registerModule(new JavaTimeModule()) ;
		ComplaintDTO complaintDto = mapper.readValue(complaintDtoJson, ComplaintDTO.class);

		String imageUrl = imageStorageService.uploadImage(image);
		complaintDto.setImage(imageUrl);

		Complaint complaint = complaintMapperService.convertComplaintDtoToEntity(complaintDto);
		Complaint saved = complaintService.create(complaint);
		return ResponseEntity.ok(complaintMapperService.convertComplaintToDTO(saved));
	}


	@PutMapping("/{id}")
	public ResponseEntity<ComplaintDTO> updateById(@PathVariable Long id, @RequestBody ComplaintDTO complaintDto) {
		Complaint updated = complaintService.updateById(id, complaintMapperService.convertComplaintDtoToEntity(complaintDto));
		return updated != null ? ResponseEntity.ok(complaintMapperService.convertComplaintToDTO(updated)) : ResponseEntity.notFound().build();
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteById(@PathVariable Long id) {
		boolean deleted = complaintService.deleteById(id);
		return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
	}
}