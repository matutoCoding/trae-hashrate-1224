import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import classnames from 'classnames';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightExtra?: React.ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  rightExtra,
  className
}) => {
  return (
    <View className={classnames(styles.header, className)}>
      <View className={styles.headerContent}>
        <View className={styles.leftArea}>
          {showBack && <Text className={styles.backIcon}>←</Text>}
          <View className={styles.titleWrap}>
            <Text className={styles.title}>{title}</Text>
            {subtitle && <Text className={styles.subtitle}>{subtitle}</Text>}
          </View>
        </View>
        {rightExtra && <View className={styles.rightArea}>{rightExtra}</View>}
      </View>
    </View>
  );
};

export default PageHeader;
