export const validateRow = (
  row,
  districtMap,
  qualificationMap,
  existingEmailsSet,
  csvEmailSet
) => {
  const errors = [];

  // Name validation (alphabets + spaces)
  const nameRegex = /^[A-Za-z\s]+$/;

  if (!row.Name || row.Name.trim().length < 3) {
    errors.push("Name must be at least 3 characters");
  } else if (!nameRegex.test(row.Name.trim())) {
    errors.push("Name must contain only alphabets");
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(row.EmailId)) {
    errors.push("Invalid email format");
  } else {
    const email = row.EmailId.toLowerCase().trim();

    // Duplicate in CSV
    if (csvEmailSet.has(email)) {
      errors.push("Duplicate email in CSV file");
    }

    // Already exists in DB
    if (existingEmailsSet.has(email)) {
      errors.push("Email already registered");
    }

    csvEmailSet.add(email);
  }

  // Mobile validation
  const mobileRegex = /^[0-9]{10}$/;

  if (!mobileRegex.test(row.MobileNumber)) {
    errors.push("Mobile number must be 10 digits");
  }

  // Gender normalization
  const gender = row.Gender?.toLowerCase().trim();

  if (["male", "m"].includes(gender)) {
    row.Gender = "Male";
  } else if (["female", "f"].includes(gender)) {
    row.Gender = "Female";
  } else {
    errors.push("Gender must be Male or Female");
  }

  // District validation (KEEPING YOUR CURRENT LOGIC)
  const districtId = districtMap.get(row.District?.toLowerCase());

  if (!districtId) {
    errors.push("Invalid district (must belong to UP)");
  }

  // Qualification validation
  const qualification = row.Qualification?.toLowerCase().trim();

  const validQualifications = ["10th", "12th", "graduate"];

  if (!validQualifications.includes(qualification)) {
    errors.push("Qualification must be 10th, 12th or Graduate");
  }

  const qualificationId = qualificationMap.get(qualification);

  if (!qualificationId) {
    errors.push("Invalid qualification");
  }

  return errors;
};