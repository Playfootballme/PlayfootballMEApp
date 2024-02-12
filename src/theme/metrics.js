import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

export const METRICS = {
  screenWidth: width < height ? width : height,
  screenHeight: height < width ? height : width,

  //borderRadius
  borderRadiusTiny: 5,
  borderRadius: 10,
  borderRadiusMedium: 15,

  //spaces
  spaceXTiny: 3,
  spaceTiny: 5,
  spaceXSmall: 8,
  spaceSmall: 12,
  spaceNormal: 15,
  spaceMedium: 20,
  spaceCompact: 25,
  spaceLarge: 30,
  spaceXLarge: 35,
  spaceXXLarge: 45,
  spaceXXXLarge: 100,

  //sizes
  sizeXTiny: 7,
  sizeTiny: 9,
  sizeSmall: 12,
  sizeNormal: 16,
  sizeMedium: 18,
  sizeCompact: 24,
  sizeLarge: 30,
  sizeXLarge: 40,
};
