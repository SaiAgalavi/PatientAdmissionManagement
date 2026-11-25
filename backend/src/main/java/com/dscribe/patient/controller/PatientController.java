package com.dscribe.patient.controller;

import com.dscribe.patient.dto.PatientRequest;
import com.dscribe.patient.entity.Patient;
import com.dscribe.patient.service.PatientService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

	private final PatientService service;

	public PatientController(PatientService service) {
		this.service = service;
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public Patient addPatient(@Valid @RequestBody PatientRequest request) {

		return service.addPatient(request);
	}

	@GetMapping
	public List<Patient> getPatients(@RequestParam(required = false) String search,
			@RequestParam(required = false) String ward, @RequestParam(required = false) String department,
			@RequestParam(required = false) String doctor) {

		return service.getPatients(search, ward, department, doctor);
	}

	@GetMapping("/{id}")
	public Patient getPatient(@PathVariable Long id) {
		return service.getPatient(id);
	}

	@PutMapping("/{id}")
	public Patient updatePatient(@PathVariable Long id, @Valid @RequestBody PatientRequest request) {

		return service.updatePatient(id, request);
	}

	@PatchMapping("/{id}/discharge")
	public Patient dischargePatient(@PathVariable Long id) {
		return service.dischargePatient(id);
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deletePatient(@PathVariable Long id) {
		service.deletePatient(id);
	}
}