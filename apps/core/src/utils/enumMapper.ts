import {
  DayOfWeek,
  GenEdType,
  ReviewStatus,
  Semester,
  StudyProgram,
  Visible,
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
      return Visible.PUB;
    case "PVT":
    case "PRIVATE":
      return Visible.PVT;
    default:
      throw new Error(`Invalid Visible: ${raw}`);
  }
}

export function mapGenEdType(raw: string): GenEdType {
  switch (raw) {
    case "NO":
    case "NOT_GENED":
      return GenEdType.NO;
    case "SC":
    case "SCIENCE":
      return GenEdType.SC;
    case "SO":
    case "SOCIAL":
      return GenEdType.SO;
    case "HU":
    case "HUMAN":
      return GenEdType.HU;
    case "IN":
    case "INTERDISCIPLINARY":
      return GenEdType.IN;
    default:
      throw new Error(`Invalid GenEdType: ${raw}`);
  }
}

export function mapDayOfWeek(raw: string): DayOfWeek {
  switch (raw) {
    case "MO":
    case "MONDAY":
      return DayOfWeek.MO;
    case "TU":
    case "TUESDAY":
      return DayOfWeek.TU;
    case "WE":
    case "WEDNESDAY":
      return DayOfWeek.WE;
    case "TH":
    case "THURSDAY":
      return DayOfWeek.TH;
    case "FR":
    case "FRIDAY":
      return DayOfWeek.FR;
    case "SA":
    case "SATURDAY":
      return DayOfWeek.SA;
    case "SU":
    case "SUNDAY":
      return DayOfWeek.SU;
    case "AR":
      return DayOfWeek.AR;
    case "IA":
      return DayOfWeek.IR;
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
      return VoteType.L;
    case "D":
    case "DISLIKE":
      return VoteType.D;
    default:
      throw new Error(`Invalid VoteType: ${raw}`);
  }
}
