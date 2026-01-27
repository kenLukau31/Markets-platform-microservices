package com.example.favorites;

import org.springframework.beans.factory.annotation.Autowired; 
import org.springframework.web.reactive.function.client.WebClient;

import org.springframework.web.client.RestTemplate;
import org.springframework.web.bind.annotation.*; 
import org.springframework.http.ResponseEntity;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional; 

@RestController
@RequestMapping("/favorites")
public class FavoriteController {

    // @Autowired
    // private FavoriteRepository repository;

    private final FavoriteRepository repository;
    private final WebClient webClient;

    public FavoriteController (FavoriteRepository repository, WebClient.Builder webClientBuilder) {
        this.repository = repository;
        this.webClient = webClientBuilder.baseUrl("http://markets-service:4000/graphql").build();
    }

    @PostMapping
    public ResponseEntity<ServiceResponse<Favorite>> createFavorite(
            @RequestBody Favorite favorite,
            @RequestHeader("Authorization") String authHeader) {

        if (favorite.getTargetId() == null || favorite.getTargetValue() == null || favorite.getUserId() == null) {
            res = new ServiceResponse<>("POST Favorites Request: UserId / TargetId / TargetValue fields are missing.", null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
        
        }

        try {
            if (favorite.getTargetValue().equals("seller")) {
                String endpoint = "http://users-service:3000/users/sellers/" + favorite.getTargetId();
                RestTemplate restTemplate = new RestTemplate();
                HttpHeaders headers = new HttpHeaders();
                headers.set("Authorization", authHeader);
                HttpEntity<String> entity = new HttpEntity<>(headers);

                ResponseEntity<String> sellerResponse = restTemplate.exchange(endpoint, HttpMethod.GET, entity, String.class);
                if (!sellerResponse.getStatusCode().is2xxSuccessful()) {
                    res = new ServiceResponse<>("POST Favorites Request: Seller not found.", null);
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
                }

            } else if (favorite.getTargetValue().equals("market")) {
                String token = authHeader.replace("Bearer ", "");
                String queryJson = "{ \"query\": \"{ market(id: \\\"" + favorite.getTargetId() + "\\\") { id } }\" }";

                String response = webClient.post()
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                        .header(HttpHeaders.CONTENT_TYPE, "application/json")
                        .bodyValue(queryJson)
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();

                if (response == null || !response.contains(favorite.getTargetId())) {
                    res = new ServiceResponse<>("POST Favorites Request: Market not found.", null);
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
                }

            } else {
                res = new ServiceResponse<>("POST Favorites Request: TargetValue must be 'seller' or 'market'.", null);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
        }
            }



            Favorite favoriteCreated = repository.save(favorite);
            res = new ServiceResponse<>("POST Favorites Request: Favorite created successfully.", favoriteCreated);
            return ResponseEntity.status(HttpStatus.CREATED).body(res);

        } catch (Exception e) {
            res = new ServiceResponse<>("POST Favorites Request: Failed to create favorite: " + e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
        }
    }

    @GetMapping
    public ResponseEntity<ServiceResponse<List<Favorite>>> getAllFavorites() {
        
        List<Favorite> list = repository.findAll();

        if (list.isEmpty()) {
            ServiceResponse<List<Favorite>> res = new ServiceResponse<>("GET All Favorites Request: No Favorites were found.", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
        }

        ServiceResponse<List<Favorite>> res = new ServiceResponse<>("GET All Favorites Request was successful.", list);
        return ResponseEntity.ok(res);
    }


    @GetMapping("/{id}")
    public ResponseEntity<ServiceResponse<Favorite>> getFavoriteById(@PathVariable String id) {
        
        Optional<Favorite> favorite = repository.findById(id);

        if (favorite.isPresent()) {
            
            ServiceResponse<Favorite> res = new ServiceResponse<>("GET Favorite By ID Request was successful.", favorite.get());
            return ResponseEntity.ok(res);
        
        } else {

            ServiceResponse<Favorite> res = new ServiceResponse<>("GET Favorite By ID Request failed.", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
        }
    }


    @GetMapping("/user/{userId}")
    public ResponseEntity<ServiceResponse<List<Favorite>>> getFavoritesByUser(@PathVariable String userId) {
        
        List<Favorite> list = repository.findByUserId(userId);

        if (list.isEmpty()) {

            ServiceResponse<List<Favorite>> res = new ServiceResponse<>("GET Favorites By User ID Request: No Favorites were found for this user.",null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
        }

        ServiceResponse<List<Favorite>> res = new ServiceResponse<>("GET Favorites by User ID Request was successful.", list);
        return ResponseEntity.ok(res);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<ServiceResponse<String>> deleteFavorite(@PathVariable String id) {
        
        Optional<Favorite> favorite = repository.findById(id);

        if (favorite.isEmpty()) {
            
            ServiceResponse<String> res = new ServiceResponse<>("DELETE Favorite Request: Favorite not found.", null);
            return ResponseEntity.badRequest().body(res);
        }

        repository.deleteById(id);

        ServiceResponse<String> res = new ServiceResponse<>("DELETE Favorite Request was successful.", id);
        return ResponseEntity.ok(res);
    }
}
