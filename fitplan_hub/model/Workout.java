package com.fitplanhub.model;
import jakarta.persistence.*;
import lombok.*;
@Entity @Getter @Setter
public class Workout {
 @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;
 private String exercise;
 private int sets;
 private int reps;
 @ManyToOne
 private FitnessPlan plan;
}
