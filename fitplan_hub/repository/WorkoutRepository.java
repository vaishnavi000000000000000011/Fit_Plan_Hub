package com.fitplanhub.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.fitplanhub.model.Workout;
public interface WorkoutRepository extends JpaRepository<Workout,Long>{}
