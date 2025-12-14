package com.fitplanhub.controller;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.fitplanhub.repository.DietPlanRepository;
import com.fitplanhub.model.DietPlan;

@RestController
@RequestMapping("/api/diets")
@RequiredArgsConstructor
public class DietPlanController {
 private final DietPlanRepository repo;
 @GetMapping public List<DietPlan> all(){ return repo.findAll(); }
 @PostMapping public DietPlan save(@RequestBody DietPlan d){ return repo.save(d); }
}
