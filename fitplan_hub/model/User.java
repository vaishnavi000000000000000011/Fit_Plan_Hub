package com.fitplanhub.model;
import jakarta.persistence.*;
//import lombok.*;
//@Entity @Getter @Setter
public class User {
 private Long id;
 private String email;

 public Long getId() {
  return id;
 }

 public void setId(Long id) {
  this.id = id;
 }

 public String getEmail() {
  return email;
 }

 public void setEmail(String email) {
  this.email = email;
 }
}

