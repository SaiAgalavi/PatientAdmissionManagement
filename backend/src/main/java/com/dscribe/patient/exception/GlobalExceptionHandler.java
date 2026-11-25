package com.dscribe.patient.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {

		Map<String, Object> errors = new LinkedHashMap<>();

		ex.getBindingResult().getFieldErrors()
				.forEach(error -> errors.putIfAbsent(error.getField(), error.getDefaultMessage()));

		return ResponseEntity.badRequest().body(Map.of("message", "Validation failed", "errors", errors));
	}

	@ExceptionHandler(ResponseStatusException.class)
	public ResponseEntity<Map<String, String>> handleStatus(ResponseStatusException ex) {

		return ResponseEntity.status(ex.getStatusCode())
				.body(Map.of("message", ex.getReason() != null ? ex.getReason() : "Request failed"));
	}
}