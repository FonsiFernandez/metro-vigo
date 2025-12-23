package com.metro.vigo.backend.line;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lines")
public class LineController {

    private final LineRepository repo;

    public LineController(LineRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Line> all() {
        return repo.findAll();
    }
}
