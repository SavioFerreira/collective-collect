package br.com.cc.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import br.com.cc.entities.Usuario;
import br.com.cc.repositories.UsuarioRepository;

@Service
public class UsuarioService {

	@Autowired
	private UsuarioRepository usuarioRepository;

	public List<Usuario> findAll() {

		return usuarioRepository.findAll();
	}

	public ResponseEntity<Usuario> findById(Long id) {

		Optional<Usuario> usuario = usuarioRepository.findById(id);

		if (usuario.isPresent()) {
			return ResponseEntity.ok(usuario.get());
		}
		return ResponseEntity.notFound().build();

	}

	public ResponseEntity<Usuario> deletebyId(Long id) {

		if (usuarioRepository.existsById(id)) {
			usuarioRepository.deleteById(id);
			return ResponseEntity.noContent().build();
		}
		return ResponseEntity.notFound().build();
	}

	public ResponseEntity<Usuario> updateById(Long id, Usuario updateUsuario) {

		if (usuarioRepository.existsById(id)) {
			updateUsuario.setCadUser(id);
			return ResponseEntity.ok(usuarioRepository.save(updateUsuario));
		}
		return ResponseEntity.notFound().build();
	}

	public Usuario save(Usuario usuario) {
		return usuarioRepository.save(usuario);
	}

}
