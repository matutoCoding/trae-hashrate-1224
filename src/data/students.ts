import type { Student } from '@/types';

const levelDescMap: Record<string, string> = {
  beginner: '零基础入门，正在学习基础技法',
  intermediate: '有一定基础，能独立完成简单作品',
  advanced: '功底扎实，追求更高艺术境界'
};

const buildStudent = (base: Omit<Student, 'levelDescription' | 'targetCourseTypes'>): Student => ({
  ...base,
  levelDescription: levelDescMap[base.level] || levelDescMap.beginner,
  targetCourseTypes: base.preferredTypes
});

export const studentList: Student[] = [
  buildStudent({
    id: 'stu001',
    name: '沈语桐',
    avatar: 'https://picsum.photos/id/1062/200/200',
    age: 16,
    level: 'intermediate',
    preferredTypes: ['sketch', 'chinese'],
    availableDays: [1, 3, 5, 6],
    preferredTime: 'afternoon',
    bio: '热爱传统艺术的高中生，学画2年，正在准备艺考，希望打好素描基础同时学习国画。',
    rating: 4.6,
    targetTeachers: ['t001', 't003']
  }),
  buildStudent({
    id: 'stu002',
    name: '苏念慈',
    avatar: 'https://picsum.photos/id/1000/200/200',
    age: 25,
    level: 'beginner',
    preferredTypes: ['watercolor', 'sketch'],
    availableDays: [0, 2, 4],
    preferredTime: 'evening',
    bio: '互联网产品经理，想通过学画放松身心。零基础，偏爱水彩的轻盈质感，希望能画出旅行中的风景。',
    rating: 4.8,
    targetTeachers: ['t002', 't001']
  }),
  buildStudent({
    id: 'stu003',
    name: '陈逸飞',
    avatar: 'https://picsum.photos/id/1003/200/200',
    age: 22,
    level: 'intermediate',
    preferredTypes: ['digital', 'sketch'],
    availableDays: [1, 3, 5, 6],
    preferredTime: 'afternoon',
    bio: '游戏设计专业大学生，想要提升数位绘画水平，目标是入行游戏原画。有一定手绘基础。',
    rating: 4.5,
    targetTeachers: ['t004', 't001']
  }),
  buildStudent({
    id: 'stu004',
    name: '林梦琪',
    avatar: 'https://picsum.photos/id/1006/200/200',
    age: 28,
    level: 'beginner',
    preferredTypes: ['watercolor', 'digital', 'creative'],
    availableDays: [0, 2, 4, 6],
    preferredTime: 'evening',
    bio: '自由插画师的梦想家，想系统学习水彩后转向数字插画。目前是上班族，只能晚上和周末上课。',
    rating: 4.7,
    targetTeachers: ['t002', 't004']
  }),
  buildStudent({
    id: 'stu005',
    name: '赵浩然',
    avatar: 'https://picsum.photos/id/1012/200/200',
    age: 30,
    level: 'advanced',
    preferredTypes: ['oil', 'watercolor', 'sketch'],
    availableDays: [0, 2, 5, 6],
    preferredTime: 'morning',
    bio: '业余画家，学画5年，想要进一步提升油画创作能力，寻找高水平老师进行一对一指导。',
    rating: 4.9,
    targetTeachers: ['t001', 't002']
  }),
  buildStudent({
    id: 'stu006',
    name: '周雅诗',
    avatar: 'https://picsum.photos/id/1027/200/200',
    age: 45,
    level: 'beginner',
    preferredTypes: ['chinese', 'creative'],
    availableDays: [5, 6],
    preferredTime: 'morning',
    bio: '退休前是小学语文老师，一直对国画心向往之，现在有时间了，想从零开始学习。',
    rating: 4.8,
    targetTeachers: ['t003', 't005']
  }),
  buildStudent({
    id: 'stu007',
    name: '吴子墨',
    avatar: 'https://picsum.photos/id/1025/200/200',
    age: 19,
    level: 'intermediate',
    preferredTypes: ['oil', 'sketch', 'chinese'],
    availableDays: [1, 4, 5, 6],
    preferredTime: 'afternoon',
    bio: '美术学院油画系大一新生，想在课余时间找名家指点，提升传统绘画功底。',
    rating: 4.7,
    targetTeachers: ['t001', 't003']
  }),
  buildStudent({
    id: 'stu008',
    name: '刘雨桐',
    avatar: 'https://picsum.photos/id/1011/200/200',
    age: 23,
    level: 'beginner',
    preferredTypes: ['digital', 'creative'],
    availableDays: [3, 4, 5, 6],
    preferredTime: 'afternoon',
    bio: '新媒体设计师，想扩展数字绘画技能，用Procreate做插画兼职。完全零基础。',
    rating: 4.6,
    targetTeachers: ['t004']
  }),
  buildStudent({
    id: 'stu009',
    name: '小明（6岁）',
    avatar: 'https://picsum.photos/id/1062/200/200',
    age: 6,
    level: 'beginner',
    preferredTypes: ['creative'],
    availableDays: [2, 4, 5, 6],
    preferredTime: 'afternoon',
    bio: '幼儿园大班小朋友，特别喜欢涂涂画画，想象力丰富，经常画恐龙和外星人。',
    rating: 4.9,
    targetTeachers: ['t005']
  }),
  buildStudent({
    id: 'stu010',
    name: '朵朵（8岁）',
    avatar: 'https://picsum.photos/id/1080/200/200',
    age: 8,
    level: 'beginner',
    preferredTypes: ['creative', 'watercolor'],
    availableDays: [3, 5, 6],
    preferredTime: 'afternoon',
    bio: '小学二年级女孩，喜欢画公主和花，很有耐心，作品经常被贴在教室展示墙上。',
    rating: 4.8,
    targetTeachers: ['t005', 't002']
  }),
  buildStudent({
    id: 'stu011',
    name: '乐乐（5岁）',
    avatar: 'https://picsum.photos/id/1011/200/200',
    age: 5,
    level: 'beginner',
    preferredTypes: ['creative'],
    availableDays: [2, 4, 6],
    preferredTime: 'afternoon',
    bio: '活泼好动的小男孩，需要有耐心的老师引导，对颜色很敏感，喜欢大胆用色。',
    rating: 4.7,
    targetTeachers: ['t005']
  }),
  buildStudent({
    id: 'stu012',
    name: '琪琪（7岁）',
    avatar: 'https://picsum.photos/id/1000/200/200',
    age: 7,
    level: 'beginner',
    preferredTypes: ['creative', 'watercolor'],
    availableDays: [3, 5],
    preferredTime: 'afternoon',
    bio: '文静的小女生，学画半年，特别喜欢水彩画小动物，有一定的观察力和专注力。',
    rating: 4.9,
    targetTeachers: ['t005', 't002']
  }),
  buildStudent({
    id: 'stu013',
    name: '豆豆（9岁）',
    avatar: 'https://picsum.photos/id/1025/200/200',
    age: 9,
    level: 'beginner',
    preferredTypes: ['creative', 'sketch'],
    availableDays: [4, 5, 6],
    preferredTime: 'morning',
    bio: '小学三年级男孩，喜欢画汽车和机器人，观察力强，线条已经比较稳定，想进一步学习素描。',
    rating: 4.6,
    targetTeachers: ['t005', 't001']
  })
];

export const getStudentById = (id: string): Student | undefined => {
  return studentList.find(s => s.id === id);
};
