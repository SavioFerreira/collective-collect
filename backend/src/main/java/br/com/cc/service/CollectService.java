package br.com.cc.service;
import br.com.cc.entity.Collect;
import java.util.List;
import java.util.Optional;

public interface CollectService {

    Collect create(Collect collect);

    List<Collect> findAll();

    Optional<Collect> findById(Long id);

    Optional<Collect> updateById(Long id, Collect collect);

    boolean deleteById(Long id);
}
