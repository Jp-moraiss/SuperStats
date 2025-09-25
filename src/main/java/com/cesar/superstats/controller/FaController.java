package com.cesar.superstats.controller;

import com.cesar.superstats.dto.FaDTO;
import com.cesar.superstats.model.entities.Fa;
import com.cesar.superstats.service.FaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/fa")
public class FaController {

    private final FaService service;

    public FaController(FaService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Fa>> findAll() {
        List<Fa> faList = service.findAll(); // supondo que você tenha um método findAll no service
        return faList.isEmpty()
                ? new ResponseEntity<>(HttpStatus.NO_CONTENT)
                : new ResponseEntity<>(faList, HttpStatus.OK);
    }


    @GetMapping("/{email}")
    public ResponseEntity<Fa> findByEmail(@PathVariable String email) {
        Optional<Fa> fa = service.findByEmail(email);
        return fa.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<String> save(@RequestBody FaDTO faDTO) {
        try {
            service.save(faDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body("Fã cadastrado com sucesso!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{email}")
    public ResponseEntity<String> update(@PathVariable String email, @RequestBody FaDTO faDTO) {
        try {
            service.update(email, faDTO);
            return ResponseEntity.ok("Fã atualizado com sucesso!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/{email}")
    public ResponseEntity<String> deleteByEmail(@PathVariable String email) {
        try {
            service.deleteByEmail(email);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
