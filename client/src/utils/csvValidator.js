export const validateRow = (row, districtMap, qualificationMap) => {
  const errors = [];

  // Name
  if (!row.Name || row.Name.trim().length < 3) {
    errors.push("Name must be at least 3 characters");
  }

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(row.EmailId)) {
    errors.push("Invalid email format");
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