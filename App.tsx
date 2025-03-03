/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useRef } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';

import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import MoveableTodoBox from './src/MoveableTodoBox';
import TodoBox from './src/TodoBox';

const hourArr = Array.from({ length: 24 }, (_, i) => i);

const dummyTodoList = [
  { id: '1', text: '고양이 밥 주기' },
  { id: '2', text: '정원에 물 주기' },
  { id: '3', text: '책 한 권 읽기' },
  { id: '4', text: '커피 한 잔 즐기기' },
  { id: '5', text: '회의 준비하기' },
  { id: '6', text: '이메일 확인하기' },
  { id: '7', text: '집 청소하기' },
  { id: '8', text: '산책하기' },
  { id: '9', text: '식료품 쇼핑하기' },
  { id: '10', text: '저녁 요리하기' },
];

function App(): React.JSX.Element {
  const todoScrollViewRef = useRef<ScrollView>(null);
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const offset = useSharedValue({ x: 0, y: 0 });

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={[backgroundStyle, styles.container]}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <View style={styles.calendarContainer}>
          <ScrollView>
            {hourArr.map(hour => (
              <View style={styles.timeBox} key={hour} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.todoContainer}>
          <ScrollView
            contentContainerStyle={styles.bottomScroll}
            ref={todoScrollViewRef}>
            {dummyTodoList.map(item => (
              <TodoBox key={item.id} text={item.text} offset={offset} />
            ))}
          </ScrollView>
        </View>

        {/* <Ball /> */}

        <MoveableTodoBox offset={offset} />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calendarContainer: {
    flex: 2,
  },
  todoContainer: {
    flex: 1,
    borderTopWidth: 3,
  },
  timeBox: {
    width: '100%',
    height: 100,
    borderWidth: 1,
    borderColor: '#C5C5C5',
  },

  bottomScroll: {
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
