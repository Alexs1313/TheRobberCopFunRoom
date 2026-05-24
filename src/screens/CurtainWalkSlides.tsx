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
import VerdictCanvas from '../components/VerdictCanvas';
import {images} from '../assets/loungeVisuals';

type CurtainSlide = {
  image: ImageSourcePropType;
  imageWidth: number;
  title: string;
  subtitle: string;
  description: string;
};

const curtainSlides: CurtainSlide[] = [
  {
    image: images.onboard1,
    imageWidth: 356,
    title: 'Welcome to the Show!',
    subtitle: 'Where Laughter is the Law',
    description:
      "Host Mike and Slick Rico face off in the ultimate comedy showdown. Pick a side, tell your jokes, and let the jury decide — who's the funniest in the land?",
  },
  {
    image: images.onboard2,
    imageWidth: 311,
    title: 'Jokes Arsenal',
    subtitle: 'Choose Your Side',
    description:
      "Browse hilarious jokes from Host Mike's stellar crew or Slick Rico's comet crew. Browse by category, use shuffle, or save your favorites to revisit anytime.",
  },
  {
    image: images.onboard3,
    imageWidth: 345,
    title: 'Epic Tales',
    subtitle: "Stories That'll Make You LOL",
    description:
      "Dive into wild adventures from the comedy circuit. Mark your favorites — they'll always rise to the front. Whether it's Mike's donut showcases or Rico's backstage flops, every story delivers.",
  },
  {
    image: images.onboard4,
    imageWidth: 344,
    title: 'Comedy Judge',
    subtitle: 'Is Your Joke Guilty of Being Funny?',
    description:
      "Write your funniest joke, then choose your judge — Host Mike or Slick Rico. They'll deliver a verdict on the spot. Share your result and see if you have what it takes.",
  },
  {
    image: images.onboard5,
    imageWidth: 350,
    title: 'The Verdict Round',
    subtitle: '2-Comedian Comedy Showdown',
    description:
      'The lounge is in session! One comedian takes the host side, the other the guest side. Each has 30 seconds to tell jokes. The crowd votes — the funniest takes the crown. Are you ready?',
  },
];

const FINAL_CURTAIN_INDEX = curtainSlides.length - 1;

const CurtainWalkSlides = () => {
  const loungeNavigator = useNavigation();
  const [curtainIndex, setCurtainIndex] = useState(0);

  const activeSlide = curtainSlides[curtainIndex];
  const isFinalCurtain = curtainIndex === FINAL_CURTAIN_INDEX;

  const enterLounge = () => {
    loungeNavigator.navigate('TabRoutes' as never);
  };

  const advanceCurtain = () => {
    if (isFinalCurtain) {
      enterLounge();
      return;
    }

    setCurtainIndex(prevIndex => prevIndex + 1);
  };

  return (
    <VerdictCanvas>
      <View style={curtainWalkSheet.velvetStage}>
        {!isFinalCurtain && (
          <Pressable style={curtainWalkSheet.leapSigil} onPress={enterLounge}>
            <Text style={curtainWalkSheet.leapCopy}>Skip</Text>
          </Pressable>
        )}

        <View style={curtainWalkSheet.slideArena}>
          <Image
            source={activeSlide.image}
            style={[curtainWalkSheet.slideArt, curtainWalkSheet.slideArtFrame]}
          />

          <Text style={curtainWalkSheet.slideGavel}>{activeSlide.title}</Text>
          <Text style={curtainWalkSheet.slideWhisper}>{activeSlide.subtitle}</Text>
          <Image source={images.underline} style={curtainWalkSheet.slideDivider} />
          <Text style={curtainWalkSheet.slideScroll}>{activeSlide.description}</Text>
        </View>

        <View style={curtainWalkSheet.slideFooter}>
          <View style={curtainWalkSheet.beadRail}>
            {curtainSlides.map((_, beadIndex) => (
              <View
                key={beadIndex}
                style={[
                  curtainWalkSheet.beadDot,
                  curtainIndex === beadIndex && curtainWalkSheet.beadDotLit,
                ]}
              />
            ))}
          </View>

          <Pressable style={curtainWalkSheet.advancePress} onPress={advanceCurtain}>
            <LinearGradient
              colors={['#0745E7', '#0C1573']}
              start={{x: 0.12, y: 0}}
              end={{x: 0.9, y: 1}}
              style={curtainWalkSheet.advanceCta}>
              <Text style={curtainWalkSheet.advanceCopy}>
                {isFinalCurtain ? '🏛️ Let\'s Go' : 'Next'}
              </Text>
              {!isFinalCurtain && <Image source={images.arrowRight} />}
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </VerdictCanvas>
  );
};

export default CurtainWalkSlides;

const curtainWalkSheet = StyleSheet.create({
  velvetStage: {
    flex: 1,
  },
  leapSigil: {
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
  leapCopy: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    fontWeight: '500',
  },
  slideArena: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 148,
  },
  slideArt: {
    marginBottom: 36,
  },
  slideArtFrame: {
    width: 390,
    height: 230,
  },
  slideGavel: {
    maxWidth: 300,
    color: '#FFE96A',
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    textAlign: 'center',
  },
  slideWhisper: {
    marginTop: 14,
    color: '#FFEFA1',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  slideDivider: {
    marginTop: 18,
  },
  slideScroll: {
    maxWidth: 320,
    marginTop: 20,
    color: 'rgba(255,255,255,0.65)',
    fontSize: 14,
    lineHeight: 22.75,
    textAlign: 'center',
  },
  slideFooter: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 46,
    alignItems: 'center',
  },
  beadRail: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 6,
    marginBottom: 24,
  },
  beadDot: {
    width: 6,
    height: 6,
    marginHorizontal: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  beadDotLit: {
    width: 20,
    backgroundColor: '#FFD700',
  },
  advanceCta: {
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
  advancePress: {
    width: '100%',
  },
  advanceCopy: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
