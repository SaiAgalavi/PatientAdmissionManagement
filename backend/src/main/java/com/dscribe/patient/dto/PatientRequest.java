package com.dscribe.patient.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record PatientRequest(

		@NotBlank(message = "Patient name is required") @Pattern(regexp = "^[\\p{L}]+(?:[ '\\-][\\p{L}]+)*$", message = "Name must contain letters only") String name,

		@NotNull(message = "Age is required") @Min(value = 0, message = "Age cannot be below 0") @Max(value = 120, message = "Age cannot exceed 120") Integer age,

		@NotBlank(message = "Gender is required") String gender,

		@NotBlank(message = "Ward is required") String ward,

		@NotBlank(message = "Department is required") String department,

		@NotBlank(message = "Doctor is required") String doctor,

		@NotNull(message = "Admission date is required") @PastOrPresent(message = "Admission date cannot be in the future") LocalDate admissionDate,

		@NotBlank(message = "Status is required") String status

) {
}