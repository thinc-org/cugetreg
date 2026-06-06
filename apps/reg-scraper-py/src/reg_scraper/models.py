from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

GenEdType = Literal["NO", "SC", "SO", "HU", "IN"]
StudyProgram = Literal["S", "T", "I"]
Semester = Literal["1", "2", "3"]
DayOfWeek = Literal["MO", "TU", "WE", "TH", "FR", "SA", "SU", "AR", "IA"]


class Period(BaseModel):
    start: str
    end: str


class ExamPeriod(BaseModel):
    period: Period
    date: str


class ClassItem(BaseModel):
    type: str
    dayOfWeek: DayOfWeek | None = None
    period: Period
    building: str | None = None
    room: str | None = None
    teachers: list[str] = Field(default_factory=list)


class Section(BaseModel):
    sectionNo: str
    closed: bool
    note: str | None = None
    genEdType: GenEdType = "NO"
    capacity: dict[str, int]
    classes: list[ClassItem] = Field(default_factory=list)


class Course(BaseModel):
    courseNo: str
    abbrName: str
    courseNameEn: str
    courseNameTh: str
    courseDescEn: str = ""
    courseDescTh: str = ""
    faculty: str
    department: str
    credit: float
    creditHours: str
    courseCondition: str = ""
    studyProgram: StudyProgram
    academicYear: str
    semester: Semester
    genEdType: GenEdType = "NO"
    midterm: ExamPeriod | None = None
    final: ExamPeriod | None = None
    sections: list[Section] = Field(default_factory=list)


class RawCoursePage(BaseModel):
    course_no: str
    study_program: StudyProgram
    academic_year: str
    semester: Semester
    html: str


class ScraperStatus(BaseModel):
    status: Literal["idle", "running", "completed", "failed"]
    started_at: datetime | None = None
    finished_at: datetime | None = None
    courses_scraped: int = 0
    courses_failed: int = 0
    message: str = ""
