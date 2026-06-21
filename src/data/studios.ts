import type { Studio } from '@/types';

export const studioList: Studio[] = [
  {
    id: 's001',
    name: '星河艺术工作室',
    address: '朝阳区望京SOHO T3 B座 1208',
    location: '朝阳区望京SOHO T3 B座 1208',
    capacity: 15,
    facilities: ['专业画架', '自然光天窗', '空调', '素材库', '休息区'],
    description: '位于望京核心商圈的现代艺术工作室，采光极好，配备专业绘画设备，适合素描、水彩等多种画种教学。',
    coverImage: 'https://picsum.photos/id/1082/750/450',
    rating: 4.8,
    typeTags: ['素描', '油画', '综合美术'],
    reviewCount: 326,
    pricePerHour: 280
  },
  {
    id: 's002',
    name: '暖阳绘画空间',
    address: '海淀区中关村创业大街 10号楼 302',
    location: '海淀区中关村创业大街 10号楼 302',
    capacity: 12,
    facilities: ['专业画架', '投影设备', '空调', '茶具区', '画廊展示墙'],
    description: '温馨文艺的绘画空间，不定期举办学员作品展览，提供下午茶服务，艺术氛围浓厚。',
    coverImage: 'https://picsum.photos/id/1048/750/450',
    rating: 4.9,
    typeTags: ['水彩', '创意画', '成人美术'],
    reviewCount: 258,
    pricePerHour: 260
  },
  {
    id: 's003',
    name: '丹青雅集画室',
    address: '东城区南锣鼓巷 雨儿胡同 15号',
    location: '东城区南锣鼓巷 雨儿胡同 15号',
    capacity: 8,
    facilities: ['中式画案', '文房四宝', '空调', '庭院', '茶室'],
    description: '坐落于老北京胡同的中式画室，专注国画和书法教学，古色古香的庭院环境让人心静如水。',
    coverImage: 'https://picsum.photos/id/1040/750/450',
    rating: 4.7,
    typeTags: ['国画', '书法', '传统艺术'],
    reviewCount: 189,
    pricePerHour: 350
  },
  {
    id: 's004',
    name: '艺境·数字艺术实验室',
    address: '朝阳区798艺术区 中二街 D09',
    location: '朝阳区798艺术区 中二街 D09',
    capacity: 20,
    facilities: ['iPad数位板', 'Procreate授权', '手绘屏', 'Mac工作站', '专业显示器'],
    description: '专注数字绘画教育的现代化实验室，配备最新数位设备，适合插画、概念设计等方向。',
    coverImage: 'https://picsum.photos/id/3/750/450',
    rating: 4.6,
    typeTags: ['数字绘画', '插画', '概念设计'],
    reviewCount: 412,
    pricePerHour: 320
  },
  {
    id: 's005',
    name: '童心绘馆·儿童画室',
    address: '西城区金融街购物中心 3层 L312',
    location: '西城区金融街购物中心 3层 L312',
    capacity: 10,
    facilities: ['儿童专用画桌', '安全颜料', '洗手池', '玩具区', '家长等候区'],
    description: '专为4-12岁儿童打造的创意绘画空间，使用环保安全材料，注重启发孩子想象力。',
    coverImage: 'https://picsum.photos/id/225/750/450',
    rating: 4.9,
    typeTags: ['儿童画', '创意美术', '启蒙教育'],
    reviewCount: 567,
    pricePerHour: 180
  }
];

export const getStudioById = (id: string): Studio | undefined => {
  return studioList.find(s => s.id === id);
};
