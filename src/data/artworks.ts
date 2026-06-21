import type { Artwork, ArtworkComment } from '@/types';
import dayjs from 'dayjs';

const makeComments = (artworkId: string, count: number): ArtworkComment[] => {
  const commentPool = [
    { userName: '艺术爱好者A', userAvatar: 'https://picsum.photos/id/1001/100/100', content: '光影处理得很棒，氛围感拉满！' },
    { userName: '画友小明', userAvatar: 'https://picsum.photos/id/1002/100/100', content: '色彩搭配真好看，请问用的什么颜料？' },
    { userName: '老师点评', userAvatar: 'https://picsum.photos/id/1005/100/100', content: '进步很大，继续保持！构图可以再大胆一些。' },
    { userName: '路过的旅人', userAvatar: 'https://picsum.photos/id/1010/100/100', content: '这幅画让我想起了家乡，感动。' },
    { userName: '美术生小张', userAvatar: 'https://picsum.photos/id/1011/100/100', content: '求教程！笔触是怎么做到这么细腻的？' },
    { userName: '文艺青年', userAvatar: 'https://picsum.photos/id/1012/100/100', content: '收藏了，每天看一遍。' },
    { userName: '新手学习中', userAvatar: 'https://picsum.photos/id/1013/100/100', content: '线条好流畅，羡慕啊！' },
    { userName: '画廊策展人', userAvatar: 'https://picsum.photos/id/1014/100/100', content: '欢迎来我们画廊参展，请私信联系。' }
  ];
  const result: ArtworkComment[] = [];
  for (let i = 0; i < count; i++) {
    const c = commentPool[i % commentPool.length];
    result.push({
      id: `${artworkId}-c${i + 1}`,
      userId: `user${1000 + i}`,
      userName: c.userName,
      userAvatar: c.userAvatar,
      content: c.content,
      createdAt: dayjs().subtract(i + 1, 'hour').format('YYYY-MM-DD HH:mm'),
      likes: Math.floor(Math.random() * 30)
    });
  }
  return result;
};

const commentCounts = [8, 15, 23, 34, 56, 41, 22, 28, 19, 48, 14, 37];
const viewCounts = [520, 860, 1230, 2340, 3560, 2890, 1450, 1980, 1120, 2670, 980, 3210];

export const artworkList: Artwork[] = [
  {
    id: 'a001',
    title: '晨曦中的静物',
    image: 'https://picsum.photos/id/1025/600/800',
    studentId: 'stu001',
    studentName: '沈语桐',
    studentAvatar: 'https://picsum.photos/id/1062/200/200',
    courseType: 'sketch',
    teacherId: 't001',
    teacherName: '李明远',
    scheduleId: 'sch001',
    createdAt: dayjs().subtract(3, 'day').format('YYYY-MM-DD'),
    description: '素描课第三次作业，尝试捕捉清晨阳光穿过静物的光影变化，整体色调偏暖。',
    likes: 42,
    comments: makeComments('a001', commentCounts[0]),
    tags: ['素描', '静物', '光影'],
    views: viewCounts[0]
  },
  {
    id: 'a002',
    title: '雨后的小巷',
    image: 'https://picsum.photos/id/1040/800/600',
    studentId: 'stu002',
    studentName: '苏念慈',
    studentAvatar: 'https://picsum.photos/id/1000/200/200',
    courseType: 'watercolor',
    teacherId: 't002',
    teacherName: '王思雨',
    scheduleId: 'sch002',
    createdAt: dayjs().subtract(5, 'day').format('YYYY-MM-DD'),
    description: '第一次尝试水彩风景写生，用湿画法画雨后地面的倒影，虽然细节还有些粗糙但整体氛围还不错。',
    likes: 68,
    comments: makeComments('a002', commentCounts[1]),
    tags: ['水彩', '风景', '写生'],
    views: viewCounts[1]
  },
  {
    id: 'a003',
    title: '墨梅图',
    image: 'https://picsum.photos/id/1028/500/700',
    studentId: 'stu006',
    studentName: '周雅诗',
    studentAvatar: 'https://picsum.photos/id/1027/200/200',
    courseType: 'chinese',
    teacherId: 't003',
    teacherName: '陈丹青',
    scheduleId: 'sch003',
    createdAt: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    description: '跟随陈老师学国画两个月，第一次尝试独立创作墨梅。老师点评"枝干颇有古意，花朵需更灵动"。',
    likes: 89,
    comments: makeComments('a003', commentCounts[2]),
    tags: ['国画', '梅花', '水墨'],
    views: viewCounts[2]
  },
  {
    id: 'a004',
    title: '赛博朋克少女',
    image: 'https://picsum.photos/id/106/600/750',
    studentId: 'stu003',
    studentName: '陈逸飞',
    studentAvatar: 'https://picsum.photos/id/1003/200/200',
    courseType: 'digital',
    teacherId: 't004',
    teacherName: '张艺涵',
    scheduleId: 'sch004',
    createdAt: dayjs().subtract(2, 'day').format('YYYY-MM-DD'),
    description: '数字插画课的期末作业，尝试赛博朋克风格的角色设计。参考了《银翼杀手》的配色。',
    likes: 156,
    comments: makeComments('a004', commentCounts[3]),
    tags: ['数字绘画', '角色设计', '赛博朋克'],
    views: viewCounts[3]
  },
  {
    id: 'a005',
    title: '我的恐龙朋友',
    image: 'https://picsum.photos/id/1074/700/600',
    studentId: 'stu009',
    studentName: '小明（6岁）',
    studentAvatar: 'https://picsum.photos/id/1062/200/200',
    courseType: 'creative',
    teacherId: 't005',
    teacherName: '林小晴',
    scheduleId: 'sch005',
    createdAt: dayjs().subtract(4, 'day').format('YYYY-MM-DD'),
    description: '画的是我最喜欢的霸王龙，它背上还长出了彩虹翅膀！老师说我的想象力超棒~',
    likes: 203,
    comments: makeComments('a005', commentCounts[4]),
    tags: ['儿童画', '恐龙', '创意'],
    views: viewCounts[4]
  },
  {
    id: 'a006',
    title: '花与少女',
    image: 'https://picsum.photos/id/1027/500/650',
    studentId: 'stu010',
    studentName: '朵朵（8岁）',
    studentAvatar: 'https://picsum.photos/id/1080/200/200',
    courseType: 'watercolor',
    teacherId: 't005',
    teacherName: '林小晴',
    createdAt: dayjs().subtract(6, 'day').format('YYYY-MM-DD'),
    description: '用妈妈给我买的新水彩笔画的，花朵的颜色是我自己调的，粉色加紫色，漂亮吗？',
    likes: 178,
    comments: makeComments('a006', commentCounts[5]),
    tags: ['儿童画', '水彩', '人物'],
    views: viewCounts[5]
  },
  {
    id: 'a007',
    title: '自画像',
    image: 'https://picsum.photos/id/1005/500/650',
    studentId: 'stu007',
    studentName: '吴子墨',
    studentAvatar: 'https://picsum.photos/id/1025/200/200',
    courseType: 'oil',
    teacherId: 't001',
    teacherName: '李明远',
    createdAt: dayjs().subtract(8, 'day').format('YYYY-MM-DD'),
    description: '油画课第一张自画像，用了伦勃朗光的处理方式。李老师说结构把握得不错，色彩层次还可以更丰富。',
    likes: 95,
    comments: makeComments('a007', commentCounts[6]),
    tags: ['油画', '人物', '自画像'],
    views: viewCounts[6]
  },
  {
    id: 'a008',
    title: '梦境森林',
    image: 'https://picsum.photos/id/1080/800/550',
    studentId: 'stu008',
    studentName: '刘雨桐',
    studentAvatar: 'https://picsum.photos/id/1011/200/200',
    courseType: 'digital',
    teacherId: 't004',
    teacherName: '张艺涵',
    createdAt: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    description: '第一次用Procreate画完整插画，参考了宫崎骏动画中的森林场景。画了整整三天，完成后超有成就感！',
    likes: 134,
    comments: makeComments('a008', commentCounts[7]),
    tags: ['数字绘画', '插画', '风景'],
    views: viewCounts[7]
  },
  {
    id: 'a009',
    title: '陶罐与水果',
    image: 'https://picsum.photos/id/102/600/500',
    studentId: 'stu005',
    studentName: '赵浩然',
    studentAvatar: 'https://picsum.photos/id/1012/200/200',
    courseType: 'oil',
    teacherId: 't001',
    teacherName: '李明远',
    createdAt: dayjs().subtract(10, 'day').format('YYYY-MM-DD'),
    description: '静物练习，重点研究陶罐的釉面反光和水果之间的色彩呼应。李老师在色调统一上给了很多建议。',
    likes: 112,
    comments: makeComments('a009', commentCounts[8]),
    tags: ['油画', '静物', '色彩'],
    views: viewCounts[8]
  },
  {
    id: 'a010',
    title: '太空探险',
    image: 'https://picsum.photos/id/1002/700/550',
    studentId: 'stu011',
    studentName: '乐乐（5岁）',
    studentAvatar: 'https://picsum.photos/id/1011/200/200',
    courseType: 'creative',
    teacherId: 't005',
    teacherName: '林小晴',
    createdAt: dayjs().subtract(3, 'day').format('YYYY-MM-DD'),
    description: '我画了火箭去月球，月球上有外星人朋友！还有好多星星在眨眼睛~',
    likes: 167,
    comments: makeComments('a010', commentCounts[9]),
    tags: ['儿童画', '太空', '创意'],
    views: viewCounts[9]
  },
  {
    id: 'a011',
    title: '兰花图',
    image: 'https://picsum.photos/id/106/550/700',
    studentId: 'stu001',
    studentName: '沈语桐',
    studentAvatar: 'https://picsum.photos/id/1062/200/200',
    courseType: 'chinese',
    teacherId: 't003',
    teacherName: '陈丹青',
    createdAt: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
    description: '第一次尝试写意兰花，叶片的穿插关系还比较生硬，需要多练习。但是陈老师说"笔墨有灵气"，好开心！',
    likes: 76,
    comments: makeComments('a011', commentCounts[10]),
    tags: ['国画', '兰花', '写意'],
    views: viewCounts[10]
  },
  {
    id: 'a012',
    title: '樱花季',
    image: 'https://picsum.photos/id/1043/800/550',
    studentId: 'stu004',
    studentName: '林梦琪',
    studentAvatar: 'https://picsum.photos/id/1006/200/200',
    courseType: 'watercolor',
    teacherId: 't002',
    teacherName: '王思雨',
    createdAt: dayjs().subtract(4, 'day').format('YYYY-MM-DD'),
    description: '春天去玉渊潭看樱花回来画的，用撒盐法做了花瓣飘落的效果，王老师说氛围感营造得很好~',
    likes: 189,
    comments: makeComments('a012', commentCounts[11]),
    tags: ['水彩', '樱花', '风景'],
    views: viewCounts[11]
  }
];

export const getArtworkById = (id: string): Artwork | undefined => {
  return artworkList.find(a => a.id === id);
};

export const getArtworksByStudent = (studentId: string): Artwork[] => {
  return artworkList.filter(a => a.studentId === studentId);
};

export const getArtworksByCourseType = (type: string): Artwork[] => {
  return artworkList.filter(a => a.courseType === type);
};

export const getArtworkStats = () => {
  const total = artworkList.length;
  const totalLikes = artworkList.reduce((sum, a) => sum + a.likes, 0);
  const totalComments = artworkList.reduce((sum, a) => sum + a.comments.length, 0);
  const totalViews = artworkList.reduce((sum, a) => sum + a.views, 0);
  const types = Array.from(new Set(artworkList.map(a => a.courseType)));
  return { total, totalLikes, totalComments, totalViews, typeCount: types.length };
};
