package br.com.cc.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.cc.entities.User;
import br.com.cc.entities.Complaint;
import br.com.cc.entities.Collect;
import br.com.cc.services.UserService;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

	@Autowired
	private UserService userService;

	@GetMapping
	public List<User> findAll(){
		return userService.findAll();
	}

	@GetMapping("/{id}")
	public ResponseEntity<User> findById(@PathVariable Long id) {
		return userService.findById(id);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<User> deleteById(@PathVariable Long id){
		return userService.deleteById(id);
	}

	@PutMapping("/{id}")
	public ResponseEntity<User> updateById(@PathVariable Long id, @RequestBody User updateUser){
		return userService.updateById(id, updateUser);
	}

	@PostMapping
	public User save(@RequestBody User user) {
		return userService.save(user);
	}

	// Método para registrar uma reclamação
	@PostMapping("/{id}/complaints")
	public ResponseEntity<Complaint> registerComplaint(@PathVariable Long id) {
		User user = userService.findById(id).getBody();
		if (user == null) {
			return ResponseEntity.notFound().build();
		}
		Complaint complaint = userService.registerComplaint(user);
		return ResponseEntity.ok(complaint); // Idealmente, deveria retornar a entidade salva, com status 201 (Created)
	}

	// Método para iniciar uma coleta
	@PostMapping("/{id}/collects")
	public ResponseEntity<Collect> startCollect(@PathVariable Long id) {
		User user = userService.findById(id).getBody();
		if (user == null) {
			return ResponseEntity.notFound().build();
		}
		Collect collect = userService.startCollect(user);
		return ResponseEntity.ok(collect); // Idealmente, deveria retornar a entidade salva, com status 201 (Created)
	}
}