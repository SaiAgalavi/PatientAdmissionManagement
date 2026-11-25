package com.dscribe.patient.service;

import com.dscribe.patient.dto.PatientRequest;
import com.dscribe.patient.entity.Patient;
import com.dscribe.patient.repository.PatientRepository;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Service
public class PatientService {

	private final PatientRepository repository;

	private static final Set<String> GENDERS = Set.of("Male", "Female", "Other");

	private static final Set<String> WARDS = Set.of("General Ward", "ICU", "Private Ward", "Emergency");

	private static final Set<String> DEPARTMENTS = Set.of("Cardiology", "Neurology", "Orthopedics", "Pediatrics",
			"General Medicine");

	private static final Set<String> DOCTORS = Set.of("Dr. Sharma", "Dr. Reddy", "Dr. Priya", "Dr. Kumar");

	private static final Set<String> STATUSES = Set.of("Admitted", "Discharged");

	public PatientService(PatientRepository repository) {
		this.repository = repository;
	}

	private void validateOptions(PatientRequest request) {

		if (!GENDERS.contains(request.gender())) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid gender selected");
		}

		if (!WARDS.contains(request.ward())) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid ward selected");
		}

		if (!DEPARTMENTS.contains(request.department())) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid department selected");
		}

		if (!DOCTORS.contains(request.doctor())) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid doctor selected");
		}

		if (!STATUSES.contains(request.status())) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status selected");
		}
	}

	private Patient mapToEntity(PatientRequest request, Patient patient) {

		validateOptions(request);

		patient.setName(request.name().trim());
		patient.setAge(request.age());
		patient.setGender(request.gender());
		patient.setWard(request.ward());
		patient.setDepartment(request.department());
		patient.setDoctor(request.doctor());
		patient.setAdmissionDate(request.admissionDate());
		patient.setStatus(request.status());

		return patient;
	}

	public Patient addPatient(PatientRequest request) {

		Patient patient = new Patient();

		return repository.save(mapToEntity(request, patient));
	}

	public List<Patient> getPatients(String search, String ward, String department, String doctor) {

		Specification<Patient> spec = (root, query, cb) -> cb.conjunction();

		if (search != null && !search.isBlank()) {
			spec = spec.and(
					(root, query, cb) -> cb.like(cb.lower(root.get("name")), "%" + search.trim().toLowerCase() + "%"));
		}

		if (ward != null && !ward.isBlank()) {
			spec = spec.and((root, query, cb) -> cb.equal(root.get("ward"), ward));
		}

		if (department != null && !department.isBlank()) {
			spec = spec.and((root, query, cb) -> cb.equal(root.get("department"), department));
		}

		if (doctor != null && !doctor.isBlank()) {
			spec = spec.and((root, query, cb) -> cb.equal(root.get("doctor"), doctor));
		}

		return repository.findAll(spec);
	}

	public Patient getPatient(Long id) {
		return repository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found"));
	}

	public Patient updatePatient(Long id, PatientRequest request) {

		Patient patient = getPatient(id);

		return repository.save(mapToEntity(request, patient));
	}

	public Patient dischargePatient(Long id) {

		Patient patient = getPatient(id);

		patient.setStatus("Discharged");

		return repository.save(patient);
	}

	public void deletePatient(Long id) {

		if (!repository.existsById(id)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found");
		}

		repository.deleteById(id);
	}
}