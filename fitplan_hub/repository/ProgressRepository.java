package com.fitplanhub.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.fitplanhub.model.Progress;
public interface ProgressRepository extends JpaRepository<Progress,Long>{}
