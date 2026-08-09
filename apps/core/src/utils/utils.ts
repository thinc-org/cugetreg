import {
  FACULTIES,
  type FacultyId,
  UNKNOWN_FACULTY,
} from "@cugetreg/utils/faculty";

export function mapFaculty(facultyId: string) {
  return FACULTIES[facultyId as FacultyId] ?? UNKNOWN_FACULTY;
}
