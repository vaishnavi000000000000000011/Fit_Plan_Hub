package com.fitplanhub.controller;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.fitplanhub.repository.ProgressRepository;
import com.fitplanhub.model.Progress;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class ProgressController {
 private final ProgressRepository repo;
 @GetMapping public List<Progress> all(){ return repo.findAll(); }
 @PostMapping public Progress save(@RequestBody Progress p){ return repo.save(p); }
}
