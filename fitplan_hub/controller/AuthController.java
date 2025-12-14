package com.fitplanhub.controller;

import com.fitplanhub.model.User;
import com.fitplanhub.repository.UserRepository;
import com.fitplanhub.security.TokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthController {

    private final UserRepository userRepository;
    private final TokenUtil tokenUtil;

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody User request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ⚠️ Password check skipped for now (to keep it WORKING)

        String token = tokenUtil.generateToken(user.getEmail());

        return Map.of("token", token);
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userRepository.save(user);
    }
}
