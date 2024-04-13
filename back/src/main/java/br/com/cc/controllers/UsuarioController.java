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

import br.com.cc.entities.Usuario;
import br.com.cc.services.UsuarioService;

@RestController
@RequestMapping("/users")
public class UsuarioController {
	
	@Autowired
	private UsuarioService usuarioService;
	
	@GetMapping
	public List<Usuario> findAll(){
		return usuarioService.findAll();
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Usuario> findbyId(@PathVariable Long id) {
		return usuarioService.findById(id);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<Usuario> deleteById(@PathVariable Long id){
		return usuarioService.deletebyId(id);
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<Usuario> updateById(@PathVariable Long id,@RequestBody Usuario updateUser){
		return usuarioService.updateById(id, updateUser);
	}
	
	@PostMapping
	public Usuario save(@RequestBody Usuario usuario) {
		return usuarioService.save(usuario);
	}
}
