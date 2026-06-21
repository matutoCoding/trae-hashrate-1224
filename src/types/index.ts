export type UserRole = 'student' | 'teacher';

export type CourseType = 'sketch' | 'watercolor' | 'oil' | 'chinese' | 'creative' | 'digital' | 'calligraphy';

export type MatchStatus = 'pending' | 'matched' | 'rejected' | 'cancelled';

export type ScheduleStatus = 'scheduled' | 'ongoing' | 'completed' | 'cancelled' | 'open' | 'full';

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Studio {
  id: string;
  name: string;
  address: string;
  location: string;
  capacity: number;
  facilities: string[];
  description: string;
  coverImage: string;
  rating: number;
  typeTags: string[];
  reviewCount: number;
  pricePerHour: number;
}

export interface CycleRule {
  id: string;
  name: string;
  weekdays: number[];
  startTime: string;
  endTime: string;
  courseType: CourseType;
  studioId: string;
  studioName: string;
  startDate: string;
  weeksCount: number;
}

export interface Schedule {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  courseType: CourseType;
  studioId: string;
  studioName: string;
  teacherId?: string;
  teacherName?: string;
  studentIds: string[];
  studentCount: number;
  maxCapacity: number;
  status: ScheduleStatus;
  cycleRuleId?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  maxStudents: number;
  enrolledCount: number;
  enrolledStudentIds: string[];
}

export interface Student {
  id: string;
  name: string;
  avatar: string;
  age: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  preferredTypes: CourseType[];
  availableDays: number[];
  preferredTime: 'morning' | 'afternoon' | 'evening' | 'weekend';
  bio: string;
  rating: number;
  targetTeachers: string[];
  levelDescription: string;
  targetCourseTypes: CourseType[];
}

export interface Teacher {
  id: string;
  name: string;
  avatar: string;
  yearsExperience: number;
  experienceYears: number;
  擅长领域: (CourseType | string)[];
  availableDays: number[];
  availableTime: 'morning' | 'afternoon' | 'evening' | 'weekend';
  bio: string;
  rating: number;
  studentCount: number;
  targetStudents: string[];
  pricePerHour: number;
}

export interface MatchResult {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  teacherId: string;
  teacherName: string;
  teacherAvatar: string;
  mutual: boolean;
  studentInterested: boolean;
  teacherInterested: boolean;
  totalScore: number;
  score: number;
  scores: {
    courseType: number;
    timeMatch: number;
    levelMatch: number;
    experience: number;
    rating: number;
  };
  status: MatchStatus;
  createdAt: string;
}

export interface ArtworkComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface Artwork {
  id: string;
  title: string;
  image: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  courseType: CourseType;
  teacherId?: string;
  teacherName?: string;
  scheduleId?: string;
  createdAt: string;
  description: string;
  likes: number;
  comments: ArtworkComment[];
  tags: string[];
  views: number;
}

export interface QuickEntry {
  key: string;
  label: string;
  color: string;
  bgColor: string;
  pagePath?: string;
}

export interface TodoItem {
  id: string;
  title: string;
  type: 'schedule' | 'match' | 'upload' | 'confirm';
  time: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}
