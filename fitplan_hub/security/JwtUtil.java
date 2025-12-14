//package com.fitplanhub.security;
//
//import org.springframework.security.oauth2.jwt.*;
//import org.springframework.stereotype.Component;
//
//import javax.crypto.spec.SecretKeySpec;
//import java.time.Instant;
//import java.util.Map;
//
//@Component
//public class JwtUtil {
//
// private static final String SECRET =
//         "fitplanhub_secret_key_fitplanhub_1234567890";
//
// private final JwtEncoder encoder;
//
// public JwtUtil() {
//  var key = new SecretKeySpec(SECRET.getBytes(), "HmacSHA256");
//  this.encoder = new NimbusJwtEncoder(
//          new ImmutableSecret<>(key)
//  );
// }
//
// public String generateToken(String email) {
//  JwtClaimsSet claims = JwtClaimsSet.builder()
//          .subject(email)
//          .issuedAt(Instant.now())
//          .expiresAt(Instant.now().plusSeconds(86400))
//          .build();
//
//  return encoder.encode(JwtEncoderParameters.from(claims))
//          .getTokenValue();
// }
//}
