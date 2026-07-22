import html2canvas from 'html2canvas-pro';

import { type ViewCourseData } from '@cugetreg/ui/organisms/view-course';
import { discardTime, formatDate, formatExamTime } from '@cugetreg/utils';
import type { ColorVariant } from '@cugetreg/utils/types';
import type {
  CartItemDetailBase,
  CartWithItemsBase,
  ExamScheduleItem,
  Period,
} from '@cugetreg/zod-schemas';

export const TIMETABLE_DEFAULT_START = 7;
export const TIMETABLE_DEFAULT_END = 19;

export type ExamData = {
  abbrName: string;
  cartItemId: string;
  courseNo: string;
  name: string;
  colorVariant: ColorVariant;
  start: Date | null;
  end: Date | null;
  duration: number; // calculated here
  sectionNo: number;
};

export function parsePeriodTime(periodTime: string): number {
  const parts = periodTime.split(':');
  const hour = Number(parts[0]);
  const minute = Number(parts[1]);

  return hour + minute / 60;
}

export async function screenshotTimetable(
  div: HTMLElement | null,
  name: string,
) {
  if (!div) return;

  const canvas = await html2canvas(div, {
    backgroundColor: null,
    logging: false,
    useCORS: true,
    scale: 3,
  });

  const screenshot = canvas.toDataURL('image/jpeg');

  const link = document.createElement('a');
  link.href = screenshot;
  link.download = `${name}_timetable.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function isConflicted(
  courseNo: string,
  period: Period,
  cartItems: CartItemDetailBase[],
): boolean {
  for (const other of cartItems) {
    if (other.hidden || other.courseNo === courseNo) continue;

    const otherSection = other.sections.find(
      (sec) => sec.sectionNo === other.sectionNo,
    );

    const periodStartTime = parsePeriodTime(period.periodStart);
    const periodEndTime = parsePeriodTime(period.periodEnd);

    if (isNaN(periodStartTime) || isNaN(periodEndTime)) continue;

    for (const otherPeriod of otherSection?.classes ?? []) {
      const otherPeriodStartTime = parsePeriodTime(otherPeriod.periodStart);
      const otherPeriodEndTime = parsePeriodTime(otherPeriod.periodEnd);

      if (isNaN(otherPeriodStartTime) || isNaN(otherPeriodEndTime)) continue;

      if (period.dayOfWeek !== otherPeriod.dayOfWeek) continue;
      if (
        periodStartTime < otherPeriodEndTime &&
        otherPeriodStartTime < periodEndTime
      ) {
        return true;
      }
    }
  }
  return false;
}

export function getViewCourseData(
  selectedCartItemId?: string,
  cart?: CartWithItemsBase,
  exams?: ExamScheduleItem[],
): ViewCourseData | null {
  if (!selectedCartItemId || !cart) return null;

  const selectedCartItem = cart.items.find(
    (item) => item.id === selectedCartItemId,
  );
  if (!selectedCartItem) return null;

  const midterm = exams?.find(
    (e) => e.cartItemId === selectedCartItem?.id && e.type === 'MIDTERM',
  );
  const final = exams?.find(
    (e) => e.cartItemId === selectedCartItem?.id && e.type === 'FINAL',
  );

  const data: ViewCourseData = {
    itemId: selectedCartItem.id,
    courseNo: selectedCartItem.courseNo,
    abbrName: selectedCartItem.course.abbrName,
    courseNameTh: selectedCartItem.course.courseNameTh,
    courseNameEn: selectedCartItem.course.courseNameEn,
    credit: selectedCartItem.course.credit,
    sections: selectedCartItem.sections.map((sec) => ({
      sectionNo: sec.sectionNo,
      closed: sec.closed,
      regis: sec.regis,
      max: sec.max,
      classes: sec.classes.map((cls) => ({
        type: cls.type,
        dayOfWeek: cls.dayOfWeek,
        periodStart: cls.periodStart,
        periodEnd: cls.periodEnd,
        building: cls.building,
        room: cls.room,
        professors: cls.professors,
      })),
    })),
    selectedSectionNo: selectedCartItem.sectionNo,
    color: (selectedCartItem.color as ColorVariant) ?? 'primary',
    midterm: midterm
      ? `${formatDate(new Date(midterm.start))} ${formatExamTime(new Date(midterm.start), (new Date(midterm.end).getTime() - new Date(midterm.start).getTime()) / (1000 * 60 * 60))}`
      : undefined,
    final: final
      ? `${formatDate(new Date(final.start))} ${formatExamTime(new Date(final.start), (new Date(final.end).getTime() - new Date(final.start).getTime()) / (1000 * 60 * 60))}`
      : undefined,
    isHidden: selectedCartItem.hidden,
  };

  return data;
}

export function examSort(a: string, b: string): number {
  const numA = Number(a);
  const numB = Number(b);

  if (numA === 0) return 1;
  else if (numB === 0) return -1;
  else return numA - numB;
}

export function getExamData(
  cart: CartWithItemsBase,
  exams: ExamScheduleItem[],
) {
  const midterms: Record<number, ExamData[]> = {};
  const finals: Record<number, ExamData[]> = {};

  if (cart && exams) {
    for (const exam of exams) {
      const course = cart.items.find((item) => item.id === exam.cartItemId);
      if (!course || course.hidden) continue;

      let dateVal = 0;
      let start: Date | null = null;
      let end: Date | null = null;
      let duration = 0;

      if (exam.start && exam.end) {
        start = new Date(exam.start);
        end = new Date(exam.end);
        dateVal = discardTime(start.getTime());
        duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      }

      const data: ExamData = {
        cartItemId: exam.cartItemId,
        courseNo: exam.courseNo,
        sectionNo: course.sectionNo,
        name:
          course.course.courseNameEn ||
          course.course.courseNameTh ||
          exam.courseNo,
        abbrName: course.course.abbrName,
        colorVariant: (course.color ?? 'primary') as ColorVariant,
        start,
        end,
        duration,
      };

      if (exam.type === 'MIDTERM') {
        if (!midterms[dateVal]) midterms[dateVal] = [];
        midterms[dateVal].push(data);
      } else if (exam.type === 'FINAL') {
        if (!finals[dateVal]) finals[dateVal] = [];
        finals[dateVal].push(data);
      }
    }
  }

  return { midterms, finals };
}

// TODO: remove any
export function getExamDateOrder(examsData: any) {
  const midterms: number[] = Object.keys(examsData.midterms)
    .sort(examSort)
    .map((x) => Number(x));
  const finals: number[] = Object.keys(examsData.finals)
    .sort(examSort)
    .map((x) => Number(x));

  return { midterms, finals };
}

export function isExamConflicted(exam: ExamData, others?: ExamData[]) {
  if (!exam.start || !exam.end) return false;
  if (!others) return false;

  const s1 = exam.start.getTime();
  const e1 = exam.end.getTime();

  for (const other of others) {
    if (other.cartItemId === exam.cartItemId) continue;
    if (!other.start || !other.end) continue;

    const s2 = other.start.getTime();
    const e2 = other.end.getTime();

    if (s1 < e2 && s2 < e1) return true;
  }

  return false;
}

export function calculateCredit(courses?: CartItemDetailBase[]): number {
  if (!courses) return 0;
  return courses.reduce(
    (acc, item) => acc + (item.hidden ? 0 : Number(item.course.credit)),
    0,
  );
}

export async function createElementScreenshot(
  filename: string,
  element?: HTMLElement,
) {
  if (!element) return;
  const canvas = await html2canvas(element, {
    backgroundColor: null,
    logging: false,
    useCORS: true,
    scale: 3,
  });

  const screenshot = canvas.toDataURL('image/jpeg');

  const link = document.createElement('a');
  link.href = screenshot;
  link.download = `${filename}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function getDays(cart: CartItemDetailBase[]) {
  const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
  const WEEKENDS = ['SAT', 'SUN'];

  const hasWeekend = cart.some((item) => {
    if (item.hidden) return false;

    const section = item.sections.find(
      (sec) => sec.sectionNo === item.sectionNo,
    );
    return section?.classes.some(
      (cls) => cls.dayOfWeek === 'SA' || cls.dayOfWeek === 'SU',
    );
  });

  return [...WEEKDAYS, ...(hasWeekend ? WEEKENDS : [])];
}

export function getLatestTime(
  cart: CartItemDetailBase[],
  fallbackTime: number,
): number {
  const latest = cart.reduce((acc, item) => {
    if (item.hidden) return acc;
    const section = item.sections.find(
      (sec) => sec.sectionNo === item.sectionNo,
    );

    const localMax =
      section?.classes.reduce((accMin, period) => {
        const periodTime = parsePeriodTime(period.periodEnd);
        return periodTime > accMin ? periodTime : accMin;
      }, acc) ?? 0;

    return localMax > acc ? localMax : acc;
  }, fallbackTime);

  return Math.ceil(latest);
}

export function getLatestExamTime(
  exams: ExamData[],
  fallbackTime: number,
): number {
  const latest = exams.reduce((acc, exam) => {
    if (!exam.end) return acc;
    const endTime = exam.end.getHours() + exam.end.getMinutes() / 60;
    return endTime > acc ? endTime : acc;
  }, fallbackTime);

  return Math.ceil(latest);
}
