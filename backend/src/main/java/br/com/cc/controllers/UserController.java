package br.com.cc.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.cc.entities.User;
import br.com.cc.services.UserService;

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
	public ResponseEntity<User> findbyId(@PathVariable Long id) {
		return userService.findById(id);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<User> deleteById(@PathVariable Long id){
		return userService.deletebyId(id);
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<User> updateById(@PathVariable Long id, @RequestBody User updateUser){
		return userService.updateById(id, updateUser);
	}
	
	@PostMapping
	public User save(@RequestBody User user) {
		return userService.save(user);
	}
}
