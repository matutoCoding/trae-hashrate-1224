import type { Student, Teacher, CourseType, ScheduleStatus } from '@/types';

export const calculateMatchScore = (student: Student, teacher: Teacher) => {
  const scores = {
    courseType: 0,
    timeMatch: 0,
    levelMatch: 0,
    experience: 0,
    rating: 0
  };

  const teacherFields = teacher as any;
  const teacherMajor = teacherFields['擅长领域'] || [];
  const courseIntersect = student.preferredTypes.filter(t => teacherMajor.includes(t));
  scores.courseType = Math.round((courseIntersect.length / Math.max(student.preferredTypes.length, 1)) * 100);

  const dayIntersect = student.availableDays.filter(d => teacher.availableDays.includes(d));
  const timeMatchPct = (student.preferredTime === teacher.availableTime ? 50 : 0) +
    Math.round((dayIntersect.length / Math.max(student.availableDays.length, 1)) * 50);
  scores.timeMatch = timeMatchPct;

  const levelMap: Record<string, number> = { beginner: 1, intermediate: 2, advanced: 3 };
  const expBuckets = [
    { max: 2, level: 1 },
    { max: 5, level: 2 },
    { max: Infinity, level: 3 }
  ];
  const teacherLevel = expBuckets.find(b => teacher.yearsExperience <= b.max)?.level || 2;
  const diff = Math.abs((levelMap[student.level] || 2) - teacherLevel);
  scores.levelMatch = diff === 0 ? 100 : diff === 1 ? 70 : 40;

  scores.experience = Math.min(100, teacher.yearsExperience * 15);

  scores.rating = Math.round(teacher.rating * 20);

  const weights = {
    courseType: 0.3,
    timeMatch: 0.25,
    levelMatch: 0.2,
    experience: 0.15,
    rating: 0.1
  };

  const totalScore = Math.round(
    scores.courseType * weights.courseType +
    scores.timeMatch * weights.timeMatch +
    scores.levelMatch * weights.levelMatch +
    scores.experience * weights.experience +
    scores.rating * weights.rating
  );

  const timeNameMap: Record<string, string> = {
    morning: '上午',
    afternoon: '下午',
    evening: '晚上',
    weekend: '周末'
  };
  const courseIntersectNames = courseIntersect.map(t => getCourseTypeName(t)).join('、') || '暂无共同课程';
  const dayIntersectCount = dayIntersect.length;
  const teacherDaysText = teacherLevel === 3 ? '资深' : teacherLevel === 2 ? '中等经验' : '新锐';

  return {
    scores,
    totalScore,
    courseScore: scores.courseType,
    courseDesc: `共同擅长：${courseIntersectNames}`,
    timeScore: scores.timeMatch,
    timeDesc: `时间偏好${student.preferredTime === teacher.availableTime ? '完全匹配' : '部分重叠'}，可用时间交集${dayIntersectCount}天`,
    levelScore: scores.levelMatch,
    levelDesc: `学员${getLevelName(student.level)}，老师${teacherDaysText}，匹配度${['不合适', '良好', '完美'][diff === 0 ? 2 : diff === 1 ? 1 : 0]}`,
    expScore: scores.experience,
    expDesc: `老师教龄${teacher.yearsExperience}年，教学经验丰富`,
    ratingScore: scores.rating,
    ratingDesc: `老师综合评分 ${teacher.rating.toFixed(1)}/5.0`
  };
};

export const getScoreLevel = (score: number): 'high' | 'medium' | 'low' => {
  if (score >= 75) return 'high';
  if (score >= 50) return 'medium';
  return 'low';
};

export const getScoreColor = (score: number): string => {
  const level = getScoreLevel(score);
  if (level === 'high') return '#34C759';
  if (level === 'medium') return '#FF9500';
  return '#FF3B30';
};

export const getScoreLabel = (score: number): string => {
  const level = getScoreLevel(score);
  if (level === 'high') return '高度契合';
  if (level === 'medium') return '中度契合';
  return '待提升';
};

export const getCourseTypeName = (type: CourseType | string): string => {
  const map: Record<string, string> = {
    sketch: '素描',
    watercolor: '水彩',
    oil: '油画',
    chinese: '国画',
    creative: '创意画',
    digital: '数字绘画',
    calligraphy: '书法'
  };
  return map[type] || type;
};

export const getLevelName = (level: string): string => {
  const map: Record<string, string> = {
    beginner: '入门',
    intermediate: '进阶',
    advanced: '高级'
  };
  return map[level] || level;
};

export const getStatusLabel = (status: ScheduleStatus | string): string => {
  const map: Record<string, string> = {
    scheduled: '待开课',
    open: '可报名',
    ongoing: '进行中',
    completed: '已结课',
    full: '已报满',
    cancelled: '已取消'
  };
  return map[status] || status;
};
