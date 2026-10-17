import { api } from '$lib/api';

import { isCancel } from 'axios';
import { SvelteSet, SvelteURLSearchParams } from 'svelte/reactivity';

import type {
  GetCourseResponse,
  Semester,
  SortBy,
  StudyProgram,
} from '@cugetreg/zod-schemas';

import { type HomeCourse, mapCourse } from './home-course';

export interface CourseQuery {
  academicYear: number;
  semester: Semester;
  studyProgram: StudyProgram;
  search: string;
  sortBy: SortBy;
  sortOrder: 'asc' | 'desc';
  noPrereq: boolean;
  genEdTypes: string[];
  faculties: string[];
  days: string[];
  assessment?: string;
  credit?: string;
  timeStart?: string;
  timeEnd?: string;
  fitCartId?: string;
  favorite: boolean;
}

interface CourseResultsOptions {
  limit?: number;
}

export class CourseResults {
  courses = $state.raw<HomeCourse[]>([]);
  isLoading = $state(false);
  hasMore = $state(true);
  totalResults = $state(0);
  error = $state<unknown>();

  readonly #limit: number;

  #query?: CourseQuery;
  #offset = 0;
  #generation = 0;
  #controller?: AbortController;

  constructor({ limit = 20 }: CourseResultsOptions = {}) {
    this.#limit = limit;
  }

  reset(query: CourseQuery) {
    this.#generation += 1;
    this.#controller?.abort();
    this.#query = {
      ...query,
      genEdTypes: [...query.genEdTypes],
      faculties: [...query.faculties],
      days: [...query.days],
    };
    this.#offset = 0;
    this.courses = [];
    this.hasMore = true;
    this.totalResults = 0;
    this.error = undefined;

    void this.#fetch(true, this.#generation, 0);
  }

  loadMore() {
    if (!this.#query || !this.hasMore || this.isLoading) return;
    void this.#fetch(false, this.#generation, this.#offset);
  }

  destroy() {
    this.#generation += 1;
    this.#controller?.abort();
    this.#controller = undefined;
  }

  async #fetch(reset: boolean, generation: number, requestedOffset: number) {
    const query = this.#query;
    if (!query || generation !== this.#generation) return;

    const controller = new AbortController();
    this.#controller = controller;
    this.isLoading = true;

    try {
      const params = this.#createParams(query, requestedOffset);
      const response = await api.get<GetCourseResponse>('/courses', {
        params,
        signal: controller.signal,
      });

      if (controller !== this.#controller || generation !== this.#generation) {
        return;
      }

      const data = response.data.data ?? [];
      const mapped = data.map(mapCourse);

      this.totalResults = response.data.total ?? 0;
      this.#offset = requestedOffset + data.length;
      this.hasMore = data.length === this.#limit;

      if (reset) {
        this.courses = mapped;
        return;
      }

      const existingKeys = new SvelteSet(
        this.courses.map((course) => course.course.id),
      );
      this.courses = [
        ...this.courses,
        ...mapped.filter((course) => !existingKeys.has(course.course.id)),
      ];
    } catch (error) {
      if (isCancel(error)) return;
      if (generation !== this.#generation) return;

      this.error = error;
      if (!reset) this.hasMore = false;
      console.error('Error fetching courses:', error);
    } finally {
      if (controller === this.#controller && generation === this.#generation) {
        this.#controller = undefined;
        this.isLoading = false;
      }
    }
  }

  #createParams(query: CourseQuery, offset: number) {
    const params = new SvelteURLSearchParams({
      academicYear: String(query.academicYear),
      semester: query.semester,
      studyProgram: query.studyProgram,
      limit: String(this.#limit),
      offset: String(offset),
      sortOrder: query.sortOrder,
      sortBy: query.sortBy,
    });

    if (query.search) params.set('q', query.search);
    if (query.noPrereq) params.set('noPrereq', 'true');
    if (query.assessment) params.set('assessment', query.assessment);
    if (query.credit) params.set('credit', query.credit);
    if (query.timeStart) params.set('timeStart', query.timeStart);
    if (query.timeEnd) params.set('timeEnd', query.timeEnd);
    if (query.fitCartId) params.set('fitCartId', query.fitCartId);
    if (query.favorite) params.set('favorite', 'true');

    for (const genEd of query.genEdTypes) {
      params.append('genEdTypes', genEd);
    }
    for (const faculty of query.faculties) {
      params.append('faculties', faculty);
    }
    for (const day of query.days) {
      params.append('days', day);
    }

    return params;
  }
}
