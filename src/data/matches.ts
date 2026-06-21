import type { MatchResult } from '@/types';
import { studentList } from './students';
import { teacherList } from './teachers';
import { calculateMatchScore } from '@/utils/score';
import dayjs from 'dayjs';

export const buildAllMatches = (): MatchResult[] => {
  const results: MatchResult[] = [];
  let id = 0;

  for (const student of studentList.slice(0, 8)) {
    for (const teacher of teacherList) {
      const scoreResult = calculateMatchScore(student, teacher);
      const { scores, totalScore } = scoreResult;
      const studentInterested = student.targetTeachers.includes(teacher.id);
      const teacherInterested = teacher.targetStudents.includes(student.id);
      const mutual = studentInterested && teacherInterested;

      if (studentInterested || teacherInterested) {
        results.push({
          id: `m${String(++id).padStart(3, '0')}`,
          studentId: student.id,
          studentName: student.name,
          studentAvatar: student.avatar,
          teacherId: teacher.id,
          teacherName: teacher.name,
          teacherAvatar: teacher.avatar,
          mutual,
          studentInterested,
          teacherInterested,
          totalScore,
          score: totalScore,
          scores,
          status: mutual ? 'matched' : 'pending',
          createdAt: dayjs().subtract(id * 2, 'hour').format('YYYY-MM-DD HH:mm')
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

export const matchResultList: MatchResult[] = buildAllMatches();

export const getMutualMatches = (): MatchResult[] => {
  return matchResultList.filter(m => m.mutual).sort((a, b) => b.totalScore - a.totalScore);
};

export const getPendingMatches = (): MatchResult[] => {
  return matchResultList.filter(m => !m.mutual);
};

export const getMatchesByStudent = (studentId: string): MatchResult[] => {
  return matchResultList.filter(m => m.studentId === studentId);
};

export const getMatchesByTeacher = (teacherId: string): MatchResult[] => {
  return matchResultList.filter(m => m.teacherId === teacherId);
};

export const getMatchById = (id: string): MatchResult | undefined => {
  return matchResultList.find(m => m.id === id);
};

export const getMatchStats = () => {
  const total = matchResultList.length;
  const mutual = matchResultList.filter(m => m.mutual).length;
  const pending = matchResultList.filter(m => !m.mutual && m.status === 'pending').length;
  const avgScore = Math.round(
    matchResultList.reduce((sum, m) => sum + m.totalScore, 0) / Math.max(total, 1)
  );
  return { total, mutual, pending, avgScore };
};
