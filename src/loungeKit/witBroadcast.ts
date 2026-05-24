import {Share} from 'react-native';

export const shareText = async (title: string, message: string) => {
  try {
    await Share.share({title, message});
  } catch {
    console.log('Share failed');
  }
};
