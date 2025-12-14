//package com.fitplanhub.repository;
package com.fitplanhub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
//import com.fitplanhub.main.model.User;
import com.fitplanhub.model.User;

//import com.fitplanhub.repository.UserRepository;
import java.util.Optional;
public interface UserRepository extends JpaRepository<User,Long>{
 Optional<User> findByEmail(String email);
}
