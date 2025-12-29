import {
  Semester,
  StudyProgram,
  Visible,
  GenEdType,
  DayOfWeek,
  ReviewStatus,
  VoteType,
} from "../generated/prisma/client.js";

export function mapSemester(raw: string): Semester {
  switch (raw) {
    case "1":
    case "FIRST":
      return Semester.FIRST;
    case "2":
    case "SECOND":
      return Semester.SECOND;
    case "3":
    case "SUMMER":
      return Semester.SUMMER;
    default:
      throw new Error(`Invalid Semester: ${raw}`);
  }
}

export function mapStudyProgram(raw: string): StudyProgram {
  switch (raw) {
    case "S":
      return StudyProgram.S;
    case "T":
      return StudyProgram.T;
    case "I":
      return StudyProgram.I;
    default:
      throw new Error(`Invalid StudyProgram: ${raw}`);
  }
}

export function mapVisible(raw: string): Visible {
  switch (raw) {
    case "PUB":
    case "PUBLIC":
      return Visible.PUBLIC;
    case "PVT":
    case "PRIVATE":
      return Visible.PRIVATE;
    default:
      throw new Error(`Invalid Visible: ${raw}`);
  }
}

export function mapGenEdType(raw: string): GenEdType {
  switch (raw) {
    case "NO":
    case "NOT_GENED":
      return GenEdType.NOT_GENED;
    case "SC":
    case "SCIENCE":
      return GenEdType.SCIENCE;
    case "SO":
    case "SOCIAL":
      return GenEdType.SOCIAL;
    case "HU":
    case "HUMAN":
      return GenEdType.HUMAN;
    case "IN":
    case "INTERDISCIPLINARY":
      return GenEdType.INTERDISCIPLINARY;
    default:
      throw new Error(`Invalid GenEdType: ${raw}`);
  }
}

export function mapDayOfWeek(raw: string): DayOfWeek {
  switch (raw) {
    case "MO":
    case "MONDAY":
      return DayOfWeek.MONDAY;
    case "TU":
    case "TUESDAY":
      return DayOfWeek.TUESDAY;
    case "WE":
    case "WEDNESDAY":
      return DayOfWeek.WEDNESDAY;
    case "TH":
    case "THURSDAY":
      return DayOfWeek.THURSDAY;
    case "FR":
    case "FRIDAY":
      return DayOfWeek.FRIDAY;
    case "SA":
    case "SATURDAY":
      return DayOfWeek.SATURDAY;
    case "SU":
    case "SUNDAY":
      return DayOfWeek.SUNDAY;
    case "AR":
    case "ARRANGED":
      return DayOfWeek.ARRANGED;
    case "IA":
    case "IRREGULAR":
      return DayOfWeek.IRREGULAR;
    default:
      throw new Error(`Invalid DayOfWeek: ${raw}`);
  }
}

export function mapReviewStatus(raw: string): ReviewStatus {
  switch (raw) {
    case "PENDING":
      return ReviewStatus.PENDING;
    case "APPROVED":
      return ReviewStatus.APPROVED;
    case "REJECTED":
      return ReviewStatus.REJECTED;
    default:
      throw new Error(`Invalid ReviewStatus: ${raw}`);
  }
}

export function mapVoteType(raw: string): VoteType {
  switch (raw) {
    case "L":
    case "LIKE":
      return VoteType.LIKE;
    case "D":
    case "DISLIKE":
      return VoteType.DISLIKE;
    default:
      throw new Error(`Invalid VoteType: ${raw}`);
  }
}
