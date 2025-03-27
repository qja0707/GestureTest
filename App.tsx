/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useRef, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  ViewToken,
} from 'react-native';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useSharedValue} from 'react-native-reanimated';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import HourBox from './src/HourBox';
import MoveableTodoBox from './src/MoveableTodoBox';
import TodoList from './src/TodoList';

const hourArr = Array.from({length: 24}, (_, i) => i);

function App(): React.JSX.Element {
  const todoScrollViewRef = useRef<ScrollView>(null);
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const offset = useSharedValue({x: 0, y: 0});

  const [isScrolling, setIsScrolling] = useState(false);

  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  const handleViewableItemsChanged = ({
    viewableItems,
    changed,
  }: {
    viewableItems: ViewToken<number>[];
    changed: ViewToken<number>[];
  }) => {
    const ids = viewableItems.map(vt => vt.item);

    setVisibleItems(ids);
  };

  const handleMomentumScrollEnd = () => {
    setIsScrolling(false);
  };

  const handleMomentumScrollBegin = () => {
    setIsScrolling(true);
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={[backgroundStyle, styles.container]}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <View style={styles.calendarContainer}>
          <FlatList
            data={hourArr}
            renderItem={({item}) => (
              <HourBox
                hour={item}
                isScrolling={isScrolling}
                isVisible={visibleItems.includes(item)}
              />
            )}
            keyExtractor={item => item + ''}
            onViewableItemsChanged={handleViewableItemsChanged}
            onMomentumScrollEnd={handleMomentumScrollEnd}
            onMomentumScrollBegin={handleMomentumScrollBegin}
          />
        </View>

        <TodoList todoScrollViewRef={todoScrollViewRef} offset={offset} />

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
