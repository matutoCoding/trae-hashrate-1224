import React, { useState } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { getMatchStats } from '@/data/matches';
import { scheduleList } from '@/data/schedules';
import { artworkList } from '@/data/artworks';

interface MenuItemConfig {
  key: string;
  icon: string;
  iconBg: string;
  label: string;
  desc?: string;
  badge?: string | number;
  path?: string;
}

const menuGroups: { title: string; items: MenuItemConfig[] }[] = [
  {
    title: '我的教学',
    items: [
      {
        key: 'courses',
        icon: '📚',
        iconBg: '#EEF1FF',
        label: '我的课程',
        desc: `${scheduleList.length} 节排课中`,
        path: '/pages/schedule/index'
      },
      {
        key: 'match',
        icon: '🤝',
        iconBg: '#F0FFF4',
        label: '我的匹配',
        desc: '查看双向撮合结果',
        badge: getMatchStats().mutual,
        path: '/pages/match/index'
      },
      {
        key: 'artworks',
        icon: '🖼️',
        iconBg: '#FFF4EC',
        label: '我的作品',
        desc: `${artworkList.filter(a => a.studentId === 'stu001').length} 幅已归档`,
        path: '/pages/gallery/index'
      }
    ]
  },
  {
    title: '画室与排课',
    items: [
      {
        key: 'studios',
        icon: '🏫',
        iconBg: '#E8F7EE',
        label: '画室建档',
        desc: '管理画室信息与设施',
        path: '/pages/schedule/index'
      },
      {
        key: 'cycle',
        icon: '🔄',
        iconBg: '#F3E8FF',
        label: '周期规则',
        desc: '批量生成课程排期',
        path: '/pages/cycle-config/index'
      }
    ]
  },
  {
    title: '设置与其他',
    items: [
      {
        key: 'notify',
        icon: '🔔',
        iconBg: '#FFF0F0',
        label: '消息通知',
        desc: '3 条未读',
        badge: 3
      },
      {
        key: 'help',
        icon: '💡',
        iconBg: '#FFF8E1',
        label: '使用帮助',
        desc: '常见问题与教程'
      },
      {
        key: 'about',
        icon: 'ℹ️',
        iconBg: '#EEF1FF',
        label: '关于艺绘',
        desc: '版本 v1.0.0'
      }
    ]
  }
];

const ProfilePage: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<'student' | 'teacher'>('student');
  const matchStats = getMatchStats();
  const myArtworks = artworkList.filter(a => a.studentId === 'stu001');
  const totalLikes = myArtworks.reduce((sum, a) => sum + a.likes, 0);

  const handleMenuClick = (item: MenuItemConfig) => {
    if (item.path) {
      if (['/pages/schedule/index', '/pages/match/index', '/pages/gallery/index'].includes(item.path)) {
        Taro.switchTab({ url: item.path }).catch(() => {
          Taro.navigateTo({ url: item.path }).catch(err => console.error('[Profile] switch error:', err));
        });
      } else {
        Taro.navigateTo({ url: item.path }).catch(err => console.error('[Profile] navigate error:', err));
      }
    } else {
      Taro.showToast({ title: `${item.label}功能开发中`, icon: 'none' });
    }
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.hero}>
        <View className={styles.userCard}>
          <Image
            className={styles.avatar}
            src='https://picsum.photos/id/1062/200/200'
            mode='aspectFill'
          />
          <View className={styles.userInfo}>
            <Text className={styles.userName}>沈语桐</Text>
            <Text className={styles.userDesc}>准备艺考中 · 学画 2 年 · 进阶水平</Text>
            <View className={styles.roleBadge}>
              <Text className={styles.roleText}>🎨 当前身份：{currentRole === 'student' ? '学员' : '老师'}</Text>
            </View>
          </View>
          <View className={styles.editBtn}>
            <Text className={styles.editBtnText}>编辑</Text>
          </View>
        </View>
      </View>

      <View className={styles.statsFloat}>
        <View className={styles.floatItem}>
          <Text className={styles.floatValue}>{scheduleList.length}</Text>
          <Text className={styles.floatLabel}>排课数</Text>
        </View>
        <View className={styles.floatItem}>
          <Text className={styles.floatValue}>{matchStats.mutual}</Text>
          <Text className={styles.floatLabel}>已撮合</Text>
        </View>
        <View className={styles.floatItem}>
          <Text className={styles.floatValue}>{myArtworks.length}</Text>
          <Text className={styles.floatLabel}>作品</Text>
        </View>
        <View className={styles.floatItem}>
          <Text className={styles.floatValue}>{totalLikes}</Text>
          <Text className={styles.floatLabel}>获赞</Text>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.roleSwitch}>
          <View
            className={classnames(styles.roleOption, currentRole === 'student' && styles.roleOptionActive)}
            onClick={() => setCurrentRole('student')}
          >
            <Text className={styles.roleIcon}>🧑‍🎨</Text>
            <Text className={styles.roleName}>学员模式</Text>
            <Text className={styles.roleHint}>学习、选课、上传作品</Text>
          </View>
          <View
            className={classnames(styles.roleOption, currentRole === 'teacher' && styles.roleOptionActive)}
            onClick={() => setCurrentRole('teacher')}
          >
            <Text className={styles.roleIcon}>👨‍🏫</Text>
            <Text className={styles.roleName}>老师模式</Text>
            <Text className={styles.roleHint}>授课、排课、管理学员</Text>
          </View>
        </View>

        {menuGroups.map(group => (
          <View key={group.title} className={styles.section}>
            <Text className={styles.sectionTitle}>{group.title}</Text>
            {group.items.map((item, idx) => (
              <View key={item.key}>
                <View className={styles.menuItem} onClick={() => handleMenuClick(item)}>
                  <View className={styles.menuIcon} style={{ background: item.iconBg }}>
                    <Text>{item.icon}</Text>
                  </View>
                  <View className={styles.menuContent}>
                    <Text className={styles.menuLabel}>{item.label}</Text>
                    {item.desc && <Text className={styles.menuDesc}>{item.desc}</Text>}
                  </View>
                  {item.badge !== undefined && (
                    <Text className={styles.menuBadge}>{item.badge}</Text>
                  )}
                  <Text className={styles.menuArrow}>›</Text>
                </View>
                {idx < group.items.length - 1 && <View className={styles.divider} />}
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default ProfilePage;
