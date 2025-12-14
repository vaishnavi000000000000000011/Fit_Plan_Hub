package com.fitplanhub.model;
import jakarta.persistence.*;
import lombok.*;
@Entity @Getter @Setter
public class DietPlan {
 @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;
 private String meal;
 private int calories;
 @ManyToOne
 private FitnessPlan plan;
}
