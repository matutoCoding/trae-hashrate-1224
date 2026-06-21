import { create } from 'zustand';
import type { Schedule, Artwork, ArtworkComment, MatchResult, Student, Teacher } from '@/types';
import { scheduleList as initialSchedules } from '@/data/schedules';
import { artworkList as initialArtworks } from '@/data/artworks';
import { studentList as initialStudents, getStudentById } from '@/data/students';
import { teacherList as initialTeachers, getTeacherById } from '@/data/teachers';
import { calculateMatchScore } from '@/utils/score';
import { studioList, getStudioById } from '@/data/studios';
import dayjs from 'dayjs';

interface IntentState {
  studentTargetTeachers: Record<string, string[]>;
  teacherTargetStudents: Record<string, string[]>;
}

interface AppState {
  schedules: Schedule[];
  artworks: Artwork[];
  students: Student[];
  teachers: Teacher[];
  matches: MatchResult[];
  intents: IntentState;

  scheduleIdSeq: number;
  artworkIdSeq: number;
  matchIdSeq: number;

  addSchedules: (newSchedules: Schedule[]) => number;
  updateSchedule: (id: string, patch: Partial<Schedule>) => void;
  cancelSchedule: (id: string) => void;
  getScheduleById: (id: string) => Schedule | undefined;

  addArtwork: (artwork: Omit<Artwork, 'id' | 'likes' | 'comments' | 'views' | 'createdAt'> & Partial<Pick<Artwork, 'createdAt'>>) => Artwork;
  addArtworkComment: (artworkId: string, comment: Omit<ArtworkComment, 'id' | 'createdAt' | 'likes'>) => void;
  likeArtwork: (artworkId: string) => void;

  setStudentTargets: (studentId: string, teacherIds: string[]) => void;
  setTeacherTargets: (teacherId: string, studentIds: string[]) => void;
  rebuildMatches: () => void;
  getMatchById: (id: string) => MatchResult | undefined;
  getMatchByPair: (studentId: string, teacherId: string) => MatchResult | undefined;
  confirmMatch: (matchId: string) => void;
  rejectMatch: (matchId: string) => void;

  getMatchStats: () => { total: number; mutual: number; pending: number; avgScore: number };
  getArtworkStats: () => { total: number; totalLikes: number; totalComments: number; totalViews: number; typeCount: number };
}

const buildMatchesFromIntents = (
  students: Student[],
  teachers: Teacher[],
  intents: IntentState,
  matchIdSeqRef: { value: number }
): MatchResult[] => {
  const results: MatchResult[] = [];

  for (const student of students) {
    for (const teacher of teachers) {
      const studentTargets = intents.studentTargetTeachers[student.id] || student.targetTeachers;
      const teacherTargets = intents.teacherTargetStudents[teacher.id] || teacher.targetStudents;
      const studentInterested = studentTargets.includes(teacher.id);
      const teacherInterested = teacherTargets.includes(student.id);

      if (studentInterested || teacherInterested) {
        const scoreResult = calculateMatchScore(student, teacher);
        const mutual = studentInterested && teacherInterested;
        matchIdSeqRef.value += 1;
        results.push({
          id: `m${String(matchIdSeqRef.value).padStart(3, '0')}`,
          studentId: student.id,
          studentName: student.name,
          studentAvatar: student.avatar,
          teacherId: teacher.id,
          teacherName: teacher.name,
          teacherAvatar: teacher.avatar,
          mutual,
          studentInterested,
          teacherInterested,
          totalScore: scoreResult.totalScore,
          score: scoreResult.totalScore,
          scores: scoreResult.scores,
          status: mutual ? 'matched' : 'pending',
          createdAt: dayjs().subtract(matchIdSeqRef.value * 2, 'hour').format('YYYY-MM-DD HH:mm')
        });
      }
    }
  }

  results.sort((a, b) => {
    if (a.mutual && !b.mutual) return -1;
    if (!a.mutual && b.mutual) return 1;
    return b.totalScore - a.totalScore;
  });

  return results;
};

const initialStudentsCopy = initialStudents.map(s => ({ ...s }));
const initialTeachersCopy = initialTeachers.map(t => ({ ...t }));
const initialSchedulesCopy = initialSchedules.map(s => ({ ...s }));
const initialArtworksCopy = initialArtworks.map(a => ({ ...a, comments: [...a.comments] }));

const initialIntents: IntentState = {
  studentTargetTeachers: {},
  teacherTargetStudents: {}
};

const seqRef = { value: 0 };
const initialMatches = buildMatchesFromIntents(initialStudentsCopy.slice(0, 8), initialTeachersCopy, initialIntents, seqRef);

export const useAppStore = create<AppState>((set, get) => ({
  schedules: initialSchedulesCopy,
  artworks: initialArtworksCopy,
  students: initialStudentsCopy,
  teachers: initialTeachersCopy,
  matches: initialMatches,
  intents: initialIntents,

  scheduleIdSeq: 100,
  artworkIdSeq: 100,
  matchIdSeq: seqRef.value,

  addSchedules: (newSchedules) => {
    const { schedules } = get();
    const { studioList: studios } = { studioList };
    let added = 0;
    const existingSet = new Set(schedules.map(s => `${s.date}-${s.startTime}-${s.endTime}-${s.studioId}`));
    const merged: Schedule[] = [...schedules];
    for (const sch of newSchedules) {
      const key = `${sch.date}-${sch.startTime}-${sch.endTime}-${sch.studioId}`;
      if (!existingSet.has(key)) {
        merged.push(sch);
        added += 1;
        existingSet.add(key);
      }
    }
    set({ schedules: merged });
    void studios;
    return added;
  },

  updateSchedule: (id, patch) => {
    set(state => ({
      schedules: state.schedules.map(s => s.id === id ? { ...s, ...patch } : s)
    }));
  },

  cancelSchedule: (id) => {
    set(state => ({
      schedules: state.schedules.map(s => s.id === id ? { ...s, status: 'cancelled' as const } : s)
    }));
  },

  getScheduleById: (id) => get().schedules.find(s => s.id === id),

  addArtwork: (artwork) => {
    const { artworkIdSeq } = get();
    const newId = `a${String(artworkIdSeq + 1).padStart(3, '0')}`;
    const fullArtwork: Artwork = {
      id: newId,
      likes: 0,
      comments: [],
      views: 1,
      createdAt: artwork.createdAt || dayjs().format('YYYY-MM-DD'),
      ...artwork
    };
    set(state => ({
      artworks: [fullArtwork, ...state.artworks],
      artworkIdSeq: artworkIdSeq + 1
    }));
    return fullArtwork;
  },

  addArtworkComment: (artworkId, comment) => {
    set(state => ({
      artworks: state.artworks.map(a => {
        if (a.id !== artworkId) return a;
        const newComment: ArtworkComment = {
          id: `${artworkId}-c${a.comments.length + 1}`,
          createdAt: dayjs().format('YYYY-MM-DD HH:mm'),
          likes: 0,
          ...comment
        };
        return { ...a, comments: [...a.comments, newComment] };
      })
    }));
  },

  likeArtwork: (artworkId) => {
    set(state => ({
      artworks: state.artworks.map(a => a.id === artworkId ? { ...a, likes: a.likes + 1 } : a)
    }));
  },

  setStudentTargets: (studentId, teacherIds) => {
    set(state => {
      const newIntents = {
        ...state.intents,
        studentTargetTeachers: { ...state.intents.studentTargetTeachers, [studentId]: teacherIds }
      };
      const seqRef2 = { value: 0 };
      const newMatches = buildMatchesFromIntents(state.students, state.teachers, newIntents, seqRef2);
      return {
        intents: newIntents,
        matches: newMatches,
        matchIdSeq: seqRef2.value
      };
    });
  },

  setTeacherTargets: (teacherId, studentIds) => {
    set(state => {
      const newIntents = {
        ...state.intents,
        teacherTargetStudents: { ...state.intents.teacherTargetStudents, [teacherId]: studentIds }
      };
      const seqRef2 = { value: 0 };
      const newMatches = buildMatchesFromIntents(state.students, state.teachers, newIntents, seqRef2);
      return {
        intents: newIntents,
        matches: newMatches,
        matchIdSeq: seqRef2.value
      };
    });
  },

  rebuildMatches: () => {
    const { students, teachers, intents } = get();
    const seqRef2 = { value: 0 };
    const newMatches = buildMatchesFromIntents(students, teachers, intents, seqRef2);
    set({ matches: newMatches, matchIdSeq: seqRef2.value });
  },

  getMatchById: (id) => get().matches.find(m => m.id === id),
  getMatchByPair: (studentId, teacherId) => get().matches.find(m => m.studentId === studentId && m.teacherId === teacherId),

  confirmMatch: (matchId) => {
    set(state => ({
      matches: state.matches.map(m => m.id === matchId ? { ...m, status: 'confirmed' as const } : m)
    }));
  },

  rejectMatch: (matchId) => {
    set(state => ({
      matches: state.matches.map(m => m.id === matchId ? { ...m, status: 'rejected' as const, mutual: false } : m)
    }));
  },

  getMatchStats: () => {
    const { matches } = get();
    const total = matches.length;
    const mutual = matches.filter(m => m.mutual).length;
    const pending = matches.filter(m => !m.mutual && m.status === 'pending').length;
    const avgScore = Math.round(matches.reduce((sum, m) => sum + m.totalScore, 0) / Math.max(total, 1));
    return { total, mutual, pending, avgScore };
  },

  getArtworkStats: () => {
    const { artworks } = get();
    const total = artworks.length;
    const totalLikes = artworks.reduce((sum, a) => sum + a.likes, 0);
    const totalComments = artworks.reduce((sum, a) => sum + a.comments.length, 0);
    const totalViews = artworks.reduce((sum, a) => sum + a.views, 0);
    const types = Array.from(new Set(artworks.map(a => a.courseType)));
    return { total, totalLikes, totalComments, totalViews, typeCount: types.length };
  }
}));

export { getStudentById, getTeacherById, getStudioById };
