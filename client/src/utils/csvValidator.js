export const validateRow = (
  row,
  districtMap,
  qualificationMap,
  existingEmailsSet,
  csvEmailSet
) => {
  const errors = [];

  // Name
  if (!row.Name || row.Name.trim().length < 3) {
    errors.push("Name must be at least 3 characters");
  }

  // Email
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

  // Mobile
  const mobileRegex = /^[0-9]{10}$/;
  if (!mobileRegex.test(row.MobileNumber)) {
    errors.push("Mobile number must be 10 digits");
  }

  // Gender
  if (!["Male", "Female"].includes(row.Gender)) {
    errors.push("Gender must be Male or Female");
  }

  // District
  const districtId = districtMap.get(row.District?.toLowerCase());
  if (!districtId) {
    errors.push("Invalid district (must belong to UP)");
  }

  // Qualification
  const qualificationId = qualificationMap.get(
    row.Qualification?.toLowerCase()
  );

  if (!qualificationId) {
    errors.push("Invalid qualification");
  }

  return errors;
};