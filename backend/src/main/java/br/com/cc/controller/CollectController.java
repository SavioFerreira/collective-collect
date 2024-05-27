package br.com.cc.controller;

import br.com.cc.dto.CollectCollaboratorDTO;
import br.com.cc.dto.CollectDTO;
import br.com.cc.dto.ComplaintDTO;
import br.com.cc.entity.Collect;
import br.com.cc.entity.Complaint;
import br.com.cc.exception.collect.CollectNotFoundException;
import br.com.cc.mapper.CollectMapperService;
import br.com.cc.service.CollectService;
import br.com.cc.service.ImageStorageService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/collect")
public class CollectController {

	@Autowired
	private CollectService collectService;

	@Autowired
	private CollectMapperService collectMapperService;

	@Autowired
	private ImageStorageService imageStorageService;

	@GetMapping
	public List<CollectDTO> findAll() {
		return collectService.findAll().stream()
				.map(collectMapperService::convertCollectToDTO)
				.collect(Collectors.toList());
	}

	@GetMapping("/{id}")
	public ResponseEntity<CollectDTO> findById(@PathVariable Long id) {
		Optional<Collect> optionalCollect = collectService.findById(id);
		if (optionalCollect.isPresent()) {
			return ResponseEntity.ok(collectMapperService.convertCollectToDTO(optionalCollect.get()));
		} else {
			throw new CollectNotFoundException("Coleta não encontrada com o ID: " + id);
		}
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteById(@PathVariable Long id) {
		if (collectService.deleteById(id)) {
			return ResponseEntity.noContent().build();
		} else {
			throw new CollectNotFoundException("Não foi possível encontrar e excluir a coleta com o ID: " + id);
		}
	}

	@PutMapping("/{id}")
	public ResponseEntity<CollectDTO> updateById(@PathVariable Long id, @RequestBody CollectDTO collectDto) {
		Collect collect = collectMapperService.convertCollectDtoToEntity(collectDto);
		Optional<Collect> updatedOptional = collectService.updateById(id, collect);
		if (updatedOptional.isPresent()) {
			return ResponseEntity.ok(collectMapperService.convertCollectToDTO(updatedOptional.get()));
		} else {
			throw new CollectNotFoundException("Não foi possível encontrar e atualizar a coleta com o ID: " + id);
		}
	}

	@PostMapping
	public ResponseEntity<CollectDTO> create(@Valid @RequestBody CollectDTO collectDto) {
		Collect collect = collectMapperService.convertCollectDtoToEntity(collectDto);
		Collect saved = collectService.create(collect);
		return ResponseEntity.ok(collectMapperService.convertCollectToDTO(saved));
	}

	@PostMapping("/{id}/addParticipant")
	public ResponseEntity<?> addParticipantToCollect(@PathVariable Long id, @RequestBody CollectCollaboratorDTO collaboratorDTO) {
		collectService.addCollaboratorToCollect(id, collaboratorDTO );
		return ResponseEntity.ok().build();
	}

	@PatchMapping("/{id}/start")
	public ResponseEntity<CollectDTO> startCollect(@PathVariable Long id) {
		collectService.startCollect(id);
		return ResponseEntity.ok().build();
	}

	@PatchMapping("/{id}/complete")
	public ResponseEntity<CollectDTO> completeCollect(@PathVariable Long id, @RequestParam("beforeImage") MultipartFile beforeImage, @RequestParam("afterImage") MultipartFile afterImage) {
		collectService.completeCollect(id, beforeImage, afterImage);
		return ResponseEntity.ok().build();
	}
}