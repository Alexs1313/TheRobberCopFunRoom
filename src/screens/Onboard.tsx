import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Background from '../components/Background';

type OnboardItem = {
  image: ImageSourcePropType;
  imageWidth: number;
  title: string;
  subtitle: string;
  description: string;
};

const onboardItems: OnboardItem[] = [
  {
    image: require('../../rmmassets/rmmimgs/onboard1.png'),
    imageWidth: 356,
    title: 'Welcome to Joke Court!',
    subtitle: 'Where Laughter is the Law',
    description:
      "Officer Mike and Slick Rico face off in the ultimate comedy showdown. Pick a side, tell your jokes, and let the jury decide — who's the funniest in the land?",
  },
  {
    image: require('../../rmmassets/rmmimgs/onboard2.png'),
    imageWidth: 311,
    title: 'Jokes Arsenal',
    subtitle: 'Choose Your Side',
    description:
      "Browse hilarious jokes from Officer Mike's police department or Slick Rico's criminal crew. Browse by category, go random, or save your favorites to revisit anytime.",
  },
  {
    image: require('../../rmmassets/rmmimgs/onboard3.png'),
    imageWidth: 345,
    title: 'Epic Tales',
    subtitle: "Stories That'll Make You LOL",
    description:
      "Dive into wild adventures from the crime world. Mark your favorites — they'll always sit at the top. Whether it's Mike's donut investigations or Rico's botched heists, every story delivers.",
  },
  {
    image: require('../../rmmassets/rmmimgs/onboard4.png'),
    imageWidth: 344,
    title: 'Comedy Judge',
    subtitle: 'Is Your Joke Guilty of Being Funny?',
    description:
      "Write your best joke, then choose your judge — Officer Mike or Slick Rico. They'll deliver a verdict on the spot. Share your result and see if you have what it takes.",
  },
  {
    image: require('../../rmmassets/rmmimgs/onboard5.png'),
    imageWidth: 350,
    title: 'The Trial',
    subtitle: '2-Player Comedy Showdown',
    description:
      'The courtroom is in session! One player takes the role of the cop, the other the robber. Each has 30 seconds to tell jokes. The crowd votes — the funniest walks free. Are you ready?',
  },
];

const LAST_INDEX = onboardItems.length - 1;

const Onboard = () => {
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(0);

  const currentItem = onboardItems[activeIndex];
  const isLast = activeIndex === LAST_INDEX;

  const goToApp = () => {
    navigation.navigate('TabRoutes' as never);
  };

  const handleNext = () => {
    if (isLast) {
      goToApp();
      return;
    }

    setActiveIndex(prevIndex => prevIndex + 1);
  };

  return (
    <Background>
      <View style={styles.safeArea}>
        {!isLast && (
          <Pressable style={styles.skipButton} onPress={goToApp}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        )}

        <View style={styles.content}>
          <Image
            source={currentItem.image}
            style={[styles.heroImage, styles.heroImageSize]}
          />

          <Text style={styles.title}>{currentItem.title}</Text>
          <Text style={styles.subtitle}>{currentItem.subtitle}</Text>
          <Image
            source={require('../../rmmassets/rmmimgs/underline.png')}
            style={styles.underline}
          />
          <Text style={styles.description}>{currentItem.description}</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.pagination}>
            {onboardItems.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, activeIndex === index && styles.activeDot]}
              />
            ))}
          </View>

          <Pressable style={styles.nextPressable} onPress={handleNext}>
            <LinearGradient
              colors={['#0745E7', '#0C1573']}
              start={{x: 0.12, y: 0}}
              end={{x: 0.9, y: 1}}
              style={styles.nextButton}>
              <Text style={styles.nextText}>
                {isLast ? '🏛️ Enter the Courtroom' : 'Next'}
              </Text>
              {!isLast && (
                <Image
                  source={require('../../rmmassets/rmmimgs/arrowright.png')}
                />
              )}
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </Background>
  );
};

export default Onboard;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 58,
    right: 24,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 61,
    height: 34,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 999,
  },
  skipText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 148,
  },
  heroImage: {
    marginBottom: 36,
  },
  heroImageSize: {
    width: 390,
    height: 230,
  },
  title: {
    maxWidth: 300,
    color: '#FFE96A',
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 14,
    color: '#FFEFA1',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  divider: {
    width: 64,
    height: 1,
    marginTop: 20,
    backgroundColor: '#FFD700',
    opacity: 0.9,
  },
  underline: {
    marginTop: 18,
  },
  description: {
    maxWidth: 320,
    marginTop: 20,
    color: 'rgba(255,255,255,0.65)',
    fontSize: 14,
    lineHeight: 22.75,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 46,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 6,
    marginBottom: 24,
  },
  dot: {
    width: 6,
    height: 6,
    marginHorizontal: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  activeDot: {
    width: 20,
    backgroundColor: '#FFD700',
  },
  nextButton: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 58,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
    borderRadius: 16,
    shadowColor: '#0745E7',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  nextPressable: {
    width: '100%',
  },
  nextText: {
    color: '#FFFFFF',
    fontSize: 16,

    fontWeight: '700',
    textAlign: 'center',
  },
});
