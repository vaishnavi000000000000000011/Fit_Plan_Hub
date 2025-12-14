package com.fitplanhub.model;
import jakarta.persistence.*;
import lombok.*;
@Entity @Getter @Setter
public class FitnessPlan {
 @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;
 private String title;
 private String description;
 private int durationWeeks;
}
