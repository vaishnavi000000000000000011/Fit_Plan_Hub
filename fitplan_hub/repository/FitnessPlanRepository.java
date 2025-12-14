package com.fitplanhub.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.fitplanhub.model.FitnessPlan;
public interface FitnessPlanRepository extends JpaRepository<FitnessPlan,Long>{}
