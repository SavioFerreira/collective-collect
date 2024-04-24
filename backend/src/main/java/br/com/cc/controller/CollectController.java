package br.com.cc.controller;
import br.com.cc.dto.CollectDTO;
import br.com.cc.entity.Collect;
import br.com.cc.mapper.CollectMapperService;
import br.com.cc.service.CollectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
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

	@GetMapping
	public List<CollectDTO> findAll(){
		return collectService.findAll().stream()
				.map(collectMapperService::convertCollectToDTO)
				.collect(Collectors.toList());
	}

	@GetMapping("/{id}")
	public ResponseEntity<CollectDTO> findById(@PathVariable Long id) {
		return collectService.findById(id)
				.map(collectMapperService::convertCollectToDTO)
				.map(ResponseEntity::ok)
				.orElseGet(() -> ResponseEntity.notFound().build());
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteById(@PathVariable Long id){
		if (collectService.deleteById(id)) {
			return ResponseEntity.noContent().build();
		}
		return ResponseEntity.notFound().build();
	}

	@PutMapping("/{id}")
	public ResponseEntity<CollectDTO> updateById(@PathVariable Long id, @RequestBody CollectDTO collectDto) {
		Collect collect = collectMapperService.convertCollectDtoToEntity(collectDto);
		Optional<Collect> updatedOptional = collectService.updateById(id, collect);
		return updatedOptional.map(collectMapperService::convertCollectToDTO)
				.map(ResponseEntity::ok)
				.orElseGet(() -> ResponseEntity.notFound().build());
	}

	@PostMapping
	public ResponseEntity<CollectDTO> create(@Valid @RequestBody CollectDTO collectDto) {
		Collect collect = collectMapperService.convertCollectDtoToEntity(collectDto);
		Collect saved = collectService.create(collect);
		return ResponseEntity.ok(collectMapperService.convertCollectToDTO(saved));
	}
}