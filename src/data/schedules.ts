import type { Schedule, CycleRule } from '@/types';
import dayjs from 'dayjs';

export const cycleRuleList: CycleRule[] = [
  {
    id: 'c001',
    name: '素描基础班·每周二四六下午',
    weekdays: [1, 3, 5],
    startTime: '14:00',
    endTime: '17:00',
    courseType: 'sketch',
    studioId: 's001',
    studioName: '星河艺术工作室',
    startDate: dayjs().format('YYYY-MM-DD'),
    weeksCount: 8
  },
  {
    id: 'c002',
    name: '水彩进阶班·每周一三五晚上',
    weekdays: [0, 2, 4],
    startTime: '18:30',
    endTime: '21:30',
    courseType: 'watercolor',
    studioId: 's002',
    studioName: '暖阳绘画空间',
    startDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    weeksCount: 6
  },
  {
    id: 'c003',
    name: '国画入门班·每周六日上午',
    weekdays: [5, 6],
    startTime: '09:00',
    endTime: '12:00',
    courseType: 'chinese',
    studioId: 's003',
    studioName: '丹青雅集画室',
    startDate: dayjs().add(3, 'day').format('YYYY-MM-DD'),
    weeksCount: 10
  }
];

const today = dayjs();
const buildSchedule = (
  base: Omit<Schedule, 'level' | 'maxStudents' | 'enrolledCount' | 'enrolledStudentIds' | 'status'>,
  level: 'beginner' | 'intermediate' | 'advanced'
): Schedule => {
  const isFull = base.studentCount >= base.maxCapacity;
  return {
    ...base,
    level,
    maxStudents: base.maxCapacity,
    enrolledCount: base.studentCount,
    enrolledStudentIds: base.studentIds,
    status: isFull ? 'full' : 'open'
  };
};

export const scheduleList: Schedule[] = [
  buildSchedule({
    id: 'sch001',
    title: '素描基础：几何石膏体光影',
    date: today.format('YYYY-MM-DD'),
    startTime: '14:00',
    endTime: '17:00',
    courseType: 'sketch',
    studioId: 's001',
    studioName: '星河艺术工作室',
    teacherId: 't001',
    teacherName: '李明远',
    studentIds: ['stu001', 'stu002', 'stu003'],
    studentCount: 3,
    maxCapacity: 8,
    cycleRuleId: 'c001'
  }, 'beginner'),
  buildSchedule({
    id: 'sch002',
    title: '水彩技法：风景湿画法',
    date: today.add(1, 'day').format('YYYY-MM-DD'),
    startTime: '18:30',
    endTime: '21:30',
    courseType: 'watercolor',
    studioId: 's002',
    studioName: '暖阳绘画空间',
    teacherId: 't002',
    teacherName: '王思雨',
    studentIds: ['stu002', 'stu004', 'stu005'],
    studentCount: 3,
    maxCapacity: 10,
    cycleRuleId: 'c002'
  }, 'intermediate'),
  buildSchedule({
    id: 'sch003',
    title: '国画入门：梅兰竹菊之梅花',
    date: today.add(2, 'day').format('YYYY-MM-DD'),
    startTime: '09:00',
    endTime: '12:00',
    courseType: 'chinese',
    studioId: 's003',
    studioName: '丹青雅集画室',
    teacherId: 't003',
    teacherName: '陈丹青',
    studentIds: ['stu001', 'stu006'],
    studentCount: 2,
    maxCapacity: 6,
    cycleRuleId: 'c003'
  }, 'beginner'),
  buildSchedule({
    id: 'sch004',
    title: '数字插画：角色原画入门',
    date: today.add(3, 'day').format('YYYY-MM-DD'),
    startTime: '10:00',
    endTime: '13:00',
    courseType: 'digital',
    studioId: 's004',
    studioName: '艺境·数字艺术实验室',
    teacherId: 't004',
    teacherName: '张艺涵',
    studentIds: ['stu003', 'stu004', 'stu007', 'stu008'],
    studentCount: 4,
    maxCapacity: 12
  }, 'beginner'),
  buildSchedule({
    id: 'sch005',
    title: '创意儿童画：奇幻森林',
    date: today.add(4, 'day').format('YYYY-MM-DD'),
    startTime: '15:00',
    endTime: '17:00',
    courseType: 'creative',
    studioId: 's005',
    studioName: '童心绘馆·儿童画室',
    teacherId: 't005',
    teacherName: '林小晴',
    studentIds: ['stu009', 'stu010', 'stu011', 'stu012', 'stu013'],
    studentCount: 5,
    maxCapacity: 8
  }, 'beginner'),
  buildSchedule({
    id: 'sch006',
    title: '油画进阶：静物构图与色彩',
    date: today.add(5, 'day').format('YYYY-MM-DD'),
    startTime: '09:30',
    endTime: '12:30',
    courseType: 'oil',
    studioId: 's001',
    studioName: '星河艺术工作室',
    teacherId: 't001',
    teacherName: '李明远',
    studentIds: ['stu005', 'stu007'],
    studentCount: 2,
    maxCapacity: 6
  }, 'advanced'),
  buildSchedule({
    id: 'sch007',
    title: '素描基础：人像五官比例',
    date: today.add(7, 'day').format('YYYY-MM-DD'),
    startTime: '14:00',
    endTime: '17:00',
    courseType: 'sketch',
    studioId: 's001',
    studioName: '星河艺术工作室',
    teacherId: 't001',
    teacherName: '李明远',
    studentIds: ['stu001', 'stu002', 'stu003'],
    studentCount: 3,
    maxCapacity: 8,
    cycleRuleId: 'c001'
  }, 'intermediate'),
  buildSchedule({
    id: 'sch008',
    title: '水彩技法：花卉写生',
    date: today.add(8, 'day').format('YYYY-MM-DD'),
    startTime: '18:30',
    endTime: '21:30',
    courseType: 'watercolor',
    studioId: 's002',
    studioName: '暖阳绘画空间',
    teacherId: 't002',
    teacherName: '王思雨',
    studentIds: ['stu002', 'stu004', 'stu005', 'stu008'],
    studentCount: 4,
    maxCapacity: 10,
    cycleRuleId: 'c002'
  }, 'intermediate')
];

export const getScheduleById = (id: string): Schedule | undefined => {
  return scheduleList.find(s => s.id === id);
};

export const getSchedulesByDate = (date: string): Schedule[] => {
  return scheduleList.filter(s => s.date === date);
};

export const getSchedulesByStudio = (studioId: string): Schedule[] => {
  return scheduleList.filter(s => s.studioId === studioId);
};
