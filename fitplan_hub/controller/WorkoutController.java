package com.fitplanhub.controller;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.fitplanhub.repository.WorkoutRepository;
import com.fitplanhub.model.Workout;

@RestController
@RequestMapping("/api/workouts")
@RequiredArgsConstructor
public class WorkoutController {
 private final WorkoutRepository repo;
 @GetMapping public List<Workout> all(){ return repo.findAll(); }
 @PostMapping public Workout save(@RequestBody Workout w){ return repo.save(w); }
}
