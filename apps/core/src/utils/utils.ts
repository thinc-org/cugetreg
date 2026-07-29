import {
  FACULTIES,
  type FacultyId,
  UNKOWN_FACULTY,
} from "@cugetreg/utils/faculty";

export function mapFaculty(facultyId: string) {
  return FACULTIES[facultyId as FacultyId] ?? UNKOWN_FACULTY;
}
