// Calculate status (Normal/High/Low) based on value and normal range
export function calculateStatus(
  value: string | number,
  normalRange: string,
  patientAge?: number,
  patientGender?: string
): "Normal" | "High" | "Low" | "Unable to determine" {
  try {
    const numValue = Number(value);
    if (isNaN(numValue)) return "Unable to determine";

    // Handle gender-specific ranges like "Male: 4.5-5.9, Female: 4.1-5.5"
    if (normalRange.includes(",") && (patientGender === "Male" || patientGender === "Female")) {
      const ranges = normalRange.split(",").map(r => r.trim());
      for (const range of ranges) {
        if (range.toLowerCase().startsWith(patientGender.toLowerCase())) {
          const values = range.split(":")[1]?.trim() || "";
          if (values) {
            return compareWithRange(numValue, values);
          }
        }
      }
    }

    // Handle age-specific ranges like "0-12 years: 50-150, 12-18: 70-170"
    if (normalRange.includes("years") && patientAge) {
      const ranges = normalRange.split(",").map(r => r.trim());
      for (const range of ranges) {
        const ageMatch = range.match(/(\d+)-(\d+)\s*years:\s*([\d.-]+)-([\d.-]+)/i);
        if (ageMatch) {
          const ageMin = Number(ageMatch[1]);
          const ageMax = Number(ageMatch[2]);
          if (patientAge >= ageMin && patientAge <= ageMax) {
            const min = Number(ageMatch[3]);
            const max = Number(ageMatch[4]);
            if (numValue < min) return "Low";
            if (numValue > max) return "High";
            return "Normal";
          }
        }
      }
    }

    // Standard range format like "5-15" or "4.5-5.9"
    return compareWithRange(numValue, normalRange);
  } catch (error) {
    return "Unable to determine";
  }
}

function compareWithRange(
  value: number,
  rangeStr: string
): "Normal" | "High" | "Low" | "Unable to determine" {
  const parts = rangeStr.split("-").map(p => Number(p.trim()));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    const [min, max] = [Math.min(parts[0], parts[1]), Math.max(parts[0], parts[1])];
    if (value < min) return "Low";
    if (value > max) return "High";
    return "Normal";
  }
  return "Unable to determine";
}

// Get badge color based on status
export function getStatusColor(status: string): string {
  switch (status) {
    case "Normal":
      return "bg-green-100 text-green-700 border-green-200";
    case "High":
      return "bg-red-100 text-red-700 border-red-200";
    case "Low":
      return "bg-orange-100 text-orange-700 border-orange-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}
