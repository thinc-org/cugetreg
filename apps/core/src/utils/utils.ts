import {
  FACULTIES,
  UNKOWN_FACULTY,
  type FacultyId,
} from "@cugetreg/utils/faculty";

export function mapFaculty(facultyId: string) {
  return FACULTIES[facultyId as FacultyId] ?? UNKOWN_FACULTY;
}
