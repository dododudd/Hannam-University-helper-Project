import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Svg, { Line, Circle } from 'react-native-svg';
import floors from './09Floors/engineeringFloor'; // engineeringFloor.js 파일 참조

const Gil = () => {
  const route = useRoute();
  const { roomId, startFloor, goalFloor } = route.params;
  const [path, setPath] = useState([]);
  const [currentImage, setCurrentImage] = useState(floors[startFloor].image);

  useEffect(() => {
    const calculatePath = () => {
      const start = { x: 50, y: 350 }; // 고정된 출발 위치
      const goal = floors[goalFloor].rooms[roomId];
      const newPath = calculateAStarPath(start, goal, startFloor, goalFloor);
      setPath(newPath);
    };

    calculatePath();
  }, [roomId, startFloor, goalFloor]);

  const calculateAStarPath = (start, goal, startFloor, goalFloor) => {
    let path = [];

    if (startFloor === goalFloor) {
      path = [
        { x: start.x, y: start.y },
        { x: start.x, y: goal.y },
        { x: goal.x, y: goal.y },
      ];
    } else {
      // 여기에서 여러 층을 이동하는 경로 계산
      const stairs = { x: 100, y: 100 }; // 임시 계단 위치
      path = [
        { x: start.x, y: start.y },
        { x: stairs.x, y: stairs.y },
        { x: stairs.x, y: stairs.y },
        { x: goal.x, y: goal.y },
      ];
    }

    return path;
  };

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>길 안내를 시작</Text>
      <Image source={currentImage} style={styles.map} />
      <Svg height={windowHeight} width={windowWidth} style={StyleSheet.absoluteFill}>
        {path.map((point, index) => (
          index < path.length - 1 && (
            <Line
              key={`line-${index}`}
              x1={path[index].x}
              y1={path[index].y}
              x2={path[index + 1].x}
              y2={path[index + 1].y}
              stroke="red"
              strokeWidth="2"
            />
          )
        ))}
        {path.map((point, index) => (
          <Circle key={`circle-${index}`} cx={point.x} cy={point.y} r="5" fill="red" />
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  map: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
});

export default Gil;
