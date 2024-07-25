package com.utipdam.mobility.controller;

import java.util.*;
import java.util.stream.Collectors;

import com.utipdam.mobility.JwtUtils;
import com.utipdam.mobility.config.AuthTokenFilter;
import com.utipdam.mobility.exception.DefaultException;
import com.utipdam.mobility.model.*;
import com.utipdam.mobility.model.entity.Role;
import com.utipdam.mobility.model.entity.ERole;
import com.utipdam.mobility.model.entity.User;
import com.utipdam.mobility.model.repository.RoleRepository;
import com.utipdam.mobility.model.repository.UserRepository;
import com.utipdam.mobility.model.service.UserDetailsImpl;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    String regex = "^[a-zA-Z0-9_-]*$";

    @PostMapping("/auth/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        if (!userDetails.isActive()){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles));
    }

    @PostMapping("/auth/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {

        if (!signUpRequest.getUsername().matches(regex)) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username must only contain alphanumeric and _ - characters!"));
        }
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()), true, null);

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);

                        break;
                    case "mod":
                        Role modRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(modRole);

                        break;
                    default:
                        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @PatchMapping("/account")
    public ResponseEntity<?> update(@RequestBody SignupRequest signUpRequest) throws DefaultException {
        if (signUpRequest.getEmail() == null && signUpRequest.getUsername() == null) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Enter email or username you want to update"));
        }

        if (signUpRequest.getUsername() != null){
            if (!signUpRequest.getUsername().matches(regex)) {
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Error: Username must only contain alphanumeric and _ - characters!"));
            }
        }

        Optional<User> userOpt = userRepository.findByUsername(AuthTokenFilter.usernameLoggedIn);

        if (userOpt.isPresent()) {
            User userData = userOpt.get();
            if (signUpRequest.getUsername() == null) {
                signUpRequest.setUsername(userData.getUsername());
            }
            if (signUpRequest.getEmail() == null) {
                signUpRequest.setEmail(userData.getEmail());
            }

            User user = new User(userData.getId(), signUpRequest.getUsername(),
                    signUpRequest.getEmail(),
                    userData.getPassword(), userData.getActive(), userData.getEndDate());

            user.setRoles(userData.getRoles());
            try {
                userRepository.save(user);
                return ResponseEntity.ok(new MessageResponse("User updated successfully!"));
            } catch (DataIntegrityViolationException ex) {
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Error: Username is already taken!"));
            }

        } else {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: User not found"));
        }

    }

    @PatchMapping("/accountPw")
    public ResponseEntity<?> updatePassword(@RequestBody LoginRequest loginRequest) {
        if (loginRequest.getPassword() == null) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Enter new password"));
        }
        Optional<User> userOpt = userRepository.findByUsername(AuthTokenFilter.usernameLoggedIn);

        if (userOpt.isPresent()) {
            User userData = userOpt.get();
            User user = new User(userData.getId(), userData.getUsername(),
                    userData.getEmail(),
                    encoder.encode(loginRequest.getPassword()), userData.getActive(), userData.getEndDate());
            user.setRoles(userData.getRoles());
            userRepository.save(user);
            return ResponseEntity.ok(new MessageResponse("Password updated successfully!"));
        } else {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: User not found"));
        }
    }

    @PatchMapping("/deactivate")
    @Transactional
    public ResponseEntity<?> deactivate() {
        Optional<User> userOpt = userRepository.findByUsername(AuthTokenFilter.usernameLoggedIn);

        if (userOpt.isPresent()) {
            User userData = userOpt.get();
            userRepository.deactivate(userData.getId());
            return ResponseEntity.ok(new MessageResponse("User deactivated successfully!"));
        } else {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: User not found"));
        }
    }

    @DeleteMapping("/deleteAccount")
    @Transactional
    public ResponseEntity<?> delete() {
        Optional<User> userOpt = userRepository.findByUsername(AuthTokenFilter.usernameLoggedIn);

        if (userOpt.isPresent()) {
            User userData = userOpt.get();
            if (userData.getUsername().equalsIgnoreCase("admin") ){
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Error: Deleting admin account not permitted. Contact system administrator."));
            }
            int random = new Random().nextInt(900000) + 100000;
            userRepository.anonymize(userData.getId(), "deletedUser" + random, random + "@anonymous.com");
            return ResponseEntity.ok(new MessageResponse("User deleted successfully!"));
        } else {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: User not found"));
        }
    }
}