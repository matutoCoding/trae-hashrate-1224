import type { Teacher } from '@/types';

export const teacherList: Teacher[] = [
  {
    id: 't001',
    name: '李明远',
    avatar: 'https://picsum.photos/id/1005/200/200',
    yearsExperience: 8,
    experienceYears: 8,
    擅长领域: ['sketch', 'oil'],
    availableDays: [0, 1, 2, 3, 5],
    availableTime: 'afternoon',
    bio: '中央美术学院油画系硕士，8年教学经验。擅长素描基础与古典油画技法，教学严谨细致，注重基本功训练。作品曾多次入选国家级美展。',
    rating: 4.9,
    studentCount: 156,
    targetStudents: ['stu001', 'stu002', 'stu005'],
    pricePerHour: 300
  },
  {
    id: 't002',
    name: '王思雨',
    avatar: 'https://picsum.photos/id/1011/200/200',
    yearsExperience: 5,
    experienceYears: 5,
    擅长领域: ['watercolor', 'creative'],
    availableDays: [0, 2, 4, 5, 6],
    availableTime: 'evening',
    bio: '清华大学美术学院视觉传达系毕业，5年水彩教学经验。画风清新灵动，善于引导学员发掘个人风格，深受年轻学员喜爱。',
    rating: 4.8,
    studentCount: 98,
    targetStudents: ['stu002', 'stu004', 'stu006'],
    pricePerHour: 260
  },
  {
    id: 't003',
    name: '陈丹青',
    avatar: 'https://picsum.photos/id/1012/200/200',
    yearsExperience: 20,
    experienceYears: 20,
    擅长领域: ['chinese', 'calligraphy'],
    availableDays: [5, 6],
    availableTime: 'morning',
    bio: '中国美术学院国画系博士，国家一级美术师。专攻花鸟山水，师从名家潘公凯先生。20年教学经验，桃李满天下。',
    rating: 5.0,
    studentCount: 320,
    targetStudents: ['stu001', 'stu006', 'stu007'],
    pricePerHour: 500
  },
  {
    id: 't004',
    name: '张艺涵',
    avatar: 'https://picsum.photos/id/1014/200/200',
    yearsExperience: 6,
    experienceYears: 6,
    擅长领域: ['digital', 'creative'],
    availableDays: [1, 3, 4, 5, 6],
    availableTime: 'afternoon',
    bio: '前网易游戏资深原画设计师，参与过《阴阳师》等项目。6年数字绘画教学经验，擅长角色设计、概念插画与Procreate教学。',
    rating: 4.7,
    studentCount: 187,
    targetStudents: ['stu003', 'stu004', 'stu008'],
    pricePerHour: 280
  },
  {
    id: 't005',
    name: '林小晴',
    avatar: 'https://picsum.photos/id/1027/200/200',
    yearsExperience: 4,
    experienceYears: 4,
    擅长领域: ['creative', 'watercolor'],
    availableDays: [2, 3, 4, 5, 6],
    availableTime: 'afternoon',
    bio: '北京师范大学学前教育专业毕业，主修儿童美术教育方向。4年儿童绘画教学经验，热爱孩子，善用故事与游戏启发创造力。',
    rating: 4.9,
    studentCount: 245,
    targetStudents: ['stu009', 'stu010', 'stu011', 'stu012'],
    pricePerHour: 180
  }
];

export const getTeacherById = (id: string): Teacher | undefined => {
  return teacherList.find(t => t.id === id);
};
