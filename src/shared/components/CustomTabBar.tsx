import React from 'react';
import { useAppSelector } from '../../core/stores/store';
import TabBar from '../../presentation/layout/TabBar'
import TutorTabBar from '../../presentation/layout/TutorTabBar';

const CustomTabBar = () => {
  const role = useAppSelector((state) => state.auth.role);

  if (role === 'Tutor') {
    return <TutorTabBar />;
  } else {
    return <TabBar/>;
  }
};

export default CustomTabBar;
