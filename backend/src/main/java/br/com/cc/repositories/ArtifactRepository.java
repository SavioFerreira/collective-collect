package br.com.cc.repositories;

import br.com.cc.entities.Artifact;
import br.com.cc.entities.Collect;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArtifactRepository extends JpaRepository<Artifact, Long>{

}
