import { Platform } from 'react-native';
import ActualMapNative from './actual-map.native';
import ActualMapWeb from './actual-map.web';

const ActualMap = Platform.OS === 'web' ? ActualMapWeb : ActualMapNative;

export default ActualMap;
