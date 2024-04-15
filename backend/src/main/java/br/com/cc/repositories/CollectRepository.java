package br.com.cc.repositories;

import br.com.cc.entities.Collect;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CollectRepository extends JpaRepository<Collect, Long>{

}
