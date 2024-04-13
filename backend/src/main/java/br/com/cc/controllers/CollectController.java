package br.com.cc.controllers;

import br.com.cc.entities.Collect;
import br.com.cc.services.CollectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/collects")
public class CollectController {
	
	@Autowired
	private CollectService collectService;
	
	@GetMapping
	public List<Collect> findAll(){
		return collectService.findAll();
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Collect> findbyId(@PathVariable Long id) {
		return collectService.findById(id);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<Collect> deleteById(@PathVariable Long id){
		return collectService.deletebyId(id);
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<Collect> updateById(@PathVariable Long id, @RequestBody Collect updateCollect){
		return collectService.updateById(id, updateCollect);
	}
	
	@PostMapping
	public Collect save(@RequestBody Collect collect) {
		return collectService.save(collect);
	}
}
