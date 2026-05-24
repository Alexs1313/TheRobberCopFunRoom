import type {Story} from '../types/verdictModels';

export const stories: Story[] = [
  {
    id: 'donut-delight',
    title: 'The Donut Delight',
    paragraphs: [
      'Host Max was enjoying the quietest evening shift at the Chuckle Courthouse when the front desk rang. A neighbor reported that someone in a dramatic cape had entered the local donut shop and was speaking in rhymes.',
      'When Max arrived, he found Comic Nova near the counter holding six chocolate donuts and explaining the frosting schedule to a very confused cashier.',
      'Nova had only stopped in because it was raining outside, but the cape and booming voice made everyone think a talent show had begun.',
      'Max ended up buying donuts for the whole line while the cashier live-streamed Nova’s pastry poetry.',
      'By closing time the shop introduced a new special called “The Verdict Glaze.”',
    ],
  },
  {
    id: 'smartest-stage-exit',
    title: 'The Smartest Stage Exit',
    paragraphs: [
      'Comic Nova believed he had created the greatest exit routine in history. He studied maps of the venue, watched backstage documentaries, and practiced dramatic running in front of a mirror.',
      'His plan was simple: finish the set, hop on a bicycle stashed outside, and vanish before the applause cooled down.',
      'Everything went perfectly until Nova realized he had locked the bicycle himself earlier that morning.',
      'In panic he tried opening the lock with a banana from his snack bag because movies had taught him absolutely nothing useful.',
      'Host Max found him debating with the bicycle while three pigeons watched like judges.',
      'Max laughed so hard he forgot to announce the next act.',
    ],
  },
  {
    id: 'courtroom-giggle-day',
    title: 'Courtroom Giggle Day',
    paragraphs: [
      'The city auditorium was packed for the famous “Comedy Verdict” featuring Host Max and Comic Nova.',
      'Max prepared serious notes, dramatic pauses, and a long explanation about why Nova had borrowed twenty pink flamingo decorations from the lobby.',
      'Nova stood up and explained he only wanted to build “the world’s first flamingo choir.”',
      'The judge tried to stay serious, but things collapsed after Nova demonstrated marching formations using ketchup bottles.',
      'Even Max started laughing when Nova shouted, “The pink birds were supposed to harmonize!”',
      'The judge finally declared a tie and sent everyone to the snack table.',
    ],
  },
  {
    id: 'curtain-call-goat',
    title: 'The Curtain Call Goat',
    paragraphs: [
      'Comic Nova needed a fast exit vehicle, but his scooter broke down minutes before curtain call. While pacing near a farm, he noticed a goat staring directly at him.',
      'For some reason, Nova decided the goat looked trustworthy.',
      'After a triumphant final joke, Nova hopped near the goat and yelled, “Go, my noble co-star!”',
      'The goat moved exactly two steps before eating flowers beside the road.',
      'Host Max caught up easily and spent ten minutes trying not to laugh while Nova motivated the goat with potato chips.',
      'The goat eventually became famous online and received more followers than both Nova and the courthouse gift shop combined.',
    ],
  },
  {
    id: 'worlds-loudest-set',
    title: 'The World’s Loudest Set',
    paragraphs: [
      'Most comedians try to stay quiet backstage. Unfortunately, Comic Nova loved singing more than whispering.',
      'During a late-night showcase at a small electronics shop, Nova began singing dramatic opera while searching for the perfect microphone.',
      'His voice echoed through the entire shopping center.',
      'Host Max arrived within minutes because several people called to report “a very emotional ghost concert.”',
      'When Max entered, Nova was standing on a table singing into a hair dryer like it was a microphone.',
      'Max waited politely until the song ended before handing Nova a bottle of water.',
      'To this day, people still remember Nova as “The Karaoke Constellation.”',
    ],
  },
  {
    id: 'fake-mustache-mystery',
    title: 'The Fake Mustache Mystery',
    paragraphs: [
      'Host Max spent three weeks searching for a performer who always left the venue wearing a giant fake mustache.',
      'One afternoon, Max stopped at a coffee shop and noticed a suspicious guest near the counter. The mustache was crooked and slowly falling into his soup.',
      'Max carefully approached, but before he could speak, the mustache detached and landed in the bowl.',
      'The entire café went silent.',
      'The guest whispered, “This is not what it looks like.”',
      'Max laughed so hard he accidentally snorted coffee through his nose.',
      'The guest surrendered the mustache immediately because he was “too embarrassed to continue the bit.”',
    ],
  },
  {
    id: 'jury-wanted-snacks',
    title: 'The Jury That Wanted Snacks',
    paragraphs: [
      'During a party courtroom showcase, Host Max and Comic Nova competed by telling jokes to impress the jury.',
      'Max told clever hosting jokes. Nova performed dramatic stories while pretending to faint every thirty seconds for extra attention.',
      'But the jury barely listened because someone had brought a giant bowl of nachos into the room.',
      'Every time Max told a joke, the jury nodded while eating chips loudly. Nova tried borrowing the nachos for attention, but the jury booed him immediately.',
      'In the final vote, the jury announced that the true star of the night was “whoever ordered the snacks.”',
      'Max and Nova stopped arguing and spent the rest of the evening eating nachos together while planning a rematch.',
    ],
  },
];

export const getStoryPreview = (story: Story) => {
  const firstParagraph = story.paragraphs[0];
  return `${firstParagraph.slice(0, 108)} ....`;
};
