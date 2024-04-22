package br.com.cc.controller;

import br.com.cc.dto.CollectDTO;
import br.com.cc.dto.UserDTO;
import br.com.cc.entity.Collect;
import br.com.cc.entity.User;
import br.com.cc.entity.WasteInfo;
import br.com.cc.service.impl.CollectServiceImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/collect")
public class CollectController {

	@Autowired
	private CollectServiceImpl collectServiceImpl;

	@GetMapping
	public List<CollectDTO> findAll(){
		return collectServiceImpl.findAll().stream()
				.map(this::convertToDTO)
				.collect(Collectors.toList());
	}

	@GetMapping("/{id}")
	public ResponseEntity<CollectDTO> findById(@PathVariable Long id) {
		return collectServiceImpl.findById(id)
				.map(this::convertToDTO)
				.map(ResponseEntity::ok)
				.orElseGet(() -> ResponseEntity.notFound().build());
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteById(@PathVariable Long id){
		if (collectServiceImpl.deleteById(id)) {
			return ResponseEntity.noContent().build();
		}
		return ResponseEntity.notFound().build();
	}

	@PutMapping("/{id}")
	public ResponseEntity<CollectDTO> updateById(@PathVariable Long id, @RequestBody CollectDTO collectDto) {
		Collect collect = convertToEntity(collectDto);
		Optional<Collect> updatedOptional = collectServiceImpl.updateById(id, collect);
		return updatedOptional.map(this::convertToDTO)
				.map(ResponseEntity::ok)
				.orElseGet(() -> ResponseEntity.notFound().build());
	}

	@PostMapping
	public ResponseEntity<CollectDTO> save(@Valid @RequestBody CollectDTO collectDto) {
		Collect collect = convertToEntity(collectDto);
		Collect saved = collectServiceImpl.create(collect);
		return ResponseEntity.ok(convertToDTO(saved));
	}

	private CollectDTO convertToDTO(Collect collect) {
		CollectDTO dto = new CollectDTO();
		dto.setId(collect.getId());
		dto.setStatus(collect.getStatus());
		dto.setDate(collect.getDate());
		dto.setCollectImage(collect.getCollectImage());

		dto.setGravity(collect.getWasteInfo().getGravity());
		dto.setType(collect.getWasteInfo().getWasteType());
		dto.setTitle(collect.getWasteInfo().getTitle());
		dto.setDescription(collect.getWasteInfo().getDescription());
		dto.setLocale(collect.getWasteInfo().getLocale());
		dto.setComplaintImage(collect.getWasteInfo().getImage());
		dto.setComplaintId(collect.getComplaint() != null ? collect.getComplaint().getId() : null);
		dto.setCollaborators(convertToUserDTOSet(collect.getCollaborators()));
		return dto;
	}

	private Collect convertToEntity(CollectDTO dto) {
		Collect collect = new Collect();
		collect.setId(dto.getId());
		collect.setStatus(dto.getStatus());
		collect.setDate(dto.getDate());
		collect.setCollectImage(dto.getCollectImage());

		WasteInfo wasteInfo = new WasteInfo();
		wasteInfo.setImage(dto.getComplaintImage());
		wasteInfo.setTitle(dto.getTitle());
		wasteInfo.setDescription(dto.getDescription());
		wasteInfo.setLocale(dto.getLocale());
		wasteInfo.setWasteType(dto.getType());
		wasteInfo.setGravity(dto.getGravity());
		collect.setWasteInfo(wasteInfo);

		return collect;
	}

	private Set<UserDTO> convertToUserDTOSet(Set<User> users) {
		return users.stream()
				.map(this::convertUserToDTO)
				.collect(Collectors.toSet());
	}

	private UserDTO convertUserToDTO(User user) {
		UserDTO dto = new UserDTO();
		dto.setId(user.getId());
		dto.setName(user.getName());
		dto.setEmail(user.getEmail());
		return dto;
	}
}