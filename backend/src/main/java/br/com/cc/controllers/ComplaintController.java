package br.com.cc.controllers;

import br.com.cc.entities.Complaint;
import br.com.cc.services.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/complaints")
public class ComplaintController {

	@Autowired
	private ComplaintService complaintService;

	@GetMapping
	public List<Complaint> findAll() {
		return complaintService.findAll();
	}

	@GetMapping("/{id}")
	public ResponseEntity<Complaint> findById(@PathVariable Long id) {
		return complaintService.findById(id)
				.map(ResponseEntity::ok)
				.orElseGet(() -> ResponseEntity.notFound().build());
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteById(@PathVariable Long id) {
		boolean deleted = complaintService.deleteById(id);
		return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
	}

	@PutMapping("/{id}")
	public ResponseEntity<Complaint> updateById(@PathVariable Long id, @RequestBody Complaint updateComplaint) {
		Complaint updated = complaintService.updateById(id, updateComplaint);
		return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
	}

	@PostMapping
	public ResponseEntity<Complaint> save(@RequestBody Complaint complaint) {
		Complaint saved = complaintService.save(complaint);
		return ResponseEntity.ok(saved);
	}
}