package br.com.cc.controllers;

import br.com.cc.entities.Complaint;
import br.com.cc.services.ComplaintService;
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
	public List<Complaint> findAll(){
		return complaintService.findAll();
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Complaint> findbyId(@PathVariable Long id) {
		return complaintService.findById(id);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<Complaint> deleteById(@PathVariable Long id){
		return complaintService.deletebyId(id);
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<Complaint> updateById(@PathVariable Long id, @RequestBody Complaint updateComplaint){
		return complaintService.updateById(id, updateComplaint);
	}
	
	@PostMapping
	public Complaint save(@RequestBody Complaint Complaint) {
		return complaintService.save(Complaint);
	}
}
