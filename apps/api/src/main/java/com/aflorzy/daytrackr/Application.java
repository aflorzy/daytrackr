package com.aflorzy.daytrackr;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.aflorzy.daytrackr.domain.Role;
import com.aflorzy.daytrackr.repositories.RoleRepository;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
@Configuration
@EnableWebMvc
public class Application implements WebMvcConfigurer {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	@Bean
	CommandLineRunner runner(RoleRepository roleRepository) {
		return args -> {
			if (!roleRepository.findByName("ROLE_ADMIN").isPresent()) {
				Role roleAdmin = new Role();
				roleAdmin.setName("ROLE_ADMIN");
				roleRepository.save(roleAdmin);
			}
			if (!roleRepository.findByName("ROLE_USER").isPresent()) {
				Role roleUser = new Role();
				roleUser.setName("ROLE_USER");
				roleRepository.save(roleUser);
			}
		};
	}

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/api/**") // Specify the URL patterns to allow
				.allowedOrigins("http://localhost:4200", "http://192.168.1.15:82"); // Allow requests from this origin
	}

}
