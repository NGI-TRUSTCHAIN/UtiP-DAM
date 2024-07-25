package com.utipdam.mobility.config;


import com.utipdam.mobility.business.OrderBusiness;
import com.utipdam.mobility.model.service.PaymentDetailService;
import com.utipdam.mobility.model.service.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.channel.ChannelProcessingFilter;
import org.springframework.security.web.authentication.AnonymousAuthenticationFilter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
// (securedEnabled = true,
// jsr250Enabled = true,
// prePostEnabled = true) // by default
public class SecurityConfig { // extends WebSecurityConfigurerAdapter {
    @Autowired
    UserDetailsServiceImpl userDetailsService;

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Autowired
    private OrderBusiness orderBusiness;
    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());

        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        //add the ApiKeyFilter to the security chain
        http.addFilterBefore(new ApiKeyFilter(orderBusiness),
                AnonymousAuthenticationFilter.class);

        http.csrf(csrf -> csrf.disable())
                .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth ->
                        auth.requestMatchers(HttpMethod.DELETE, "/datasetDefinition/*").authenticated()
                                .requestMatchers(HttpMethod.PUT, "/datasetDefinition/*").authenticated()
                                .requestMatchers(HttpMethod.DELETE, "/dataset/*").authenticated()
                                .requestMatchers(HttpMethod.DELETE, "/organization/*").authenticated()
                                .requestMatchers(HttpMethod.POST, "/mobility/anonymizationJob").authenticated()
                                .requestMatchers(HttpMethod.POST, "/mobility/anonymizationJob/*").authenticated()
                                .requestMatchers(HttpMethod.PATCH, "/account").authenticated()
                                .requestMatchers(HttpMethod.PATCH, "/accountPw").authenticated()
                                .requestMatchers(HttpMethod.PATCH, "/deactivate").authenticated()
                                .requestMatchers(HttpMethod.GET, "/myDatasets").authenticated()
                                .requestMatchers(HttpMethod.GET, "/vendor").authenticated()
                                .requestMatchers(HttpMethod.POST, "/vendor").authenticated()
                                .requestMatchers(HttpMethod.PUT, "/vendor/*").authenticated()
                                .requestMatchers(HttpMethod.POST, "/checkout").authenticated()
                                .requestMatchers(HttpMethod.GET, "/myPurchases").authenticated()
                                .requestMatchers(HttpMethod.GET, "/purchase/*").authenticated()
                                .requestMatchers(HttpMethod.GET, "/invoices").authenticated()
                                .requestMatchers(HttpMethod.PATCH, "/invoice/licenseActivation/*").authenticated()
                                .requestMatchers(HttpMethod.PATCH, "/invoice/licenseDeactivation/*").authenticated()
                                .requestMatchers(HttpMethod.POST, "/license").authenticated()
                                .requestMatchers(HttpMethod.PATCH, "/license/*").authenticated()
                                .requestMatchers(HttpMethod.DELETE, "/license/*").authenticated()
                                .requestMatchers(HttpMethod.GET, "/licenses").authenticated()
                                .requestMatchers(HttpMethod.GET, "/licenses/approval").authenticated()
                                .requestMatchers(HttpMethod.DELETE, "/deleteAccount").authenticated()
                                .requestMatchers("/**").permitAll().anyRequest().authenticated()
                );

        http.authenticationProvider(authenticationProvider());

        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


}