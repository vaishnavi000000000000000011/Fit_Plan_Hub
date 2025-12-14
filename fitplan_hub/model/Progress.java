package com.fitplanhub.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
@Entity @Getter @Setter
public class Progress {
 @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;
 private double weight;
 private double bmi;
 private LocalDate date;
 @ManyToOne
 private User user;
}
