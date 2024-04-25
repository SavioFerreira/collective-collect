package br.com.cc.repository;
import br.com.cc.entity.Collect;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CollectRepository extends JpaRepository<Collect, Long>{

    Optional<Collect> findByComplaintId(Long complaintId);

}
