import type {Story} from '../types/content';

export const stories: Story[] = [
  {
    id: 'donut-emergency',
    title: 'The Donut Emergency',
    paragraphs: [
      'Officer Mike was enjoying the quietest night shift of his career when the police station suddenly received an emergency call. A woman screamed that a masked robber had entered the local donut shop. Mike immediately jumped into his car and drove there with sirens blasting dramatically through the streets.',
      'When he burst through the door, he saw the “dangerous criminal” standing near the counter holding six chocolate donuts and crying loudly. The robber explained that he had only entered the shop because it was raining outside, but the cashier panicked after seeing his black hoodie and ski mask.',
      'The funniest part was that the robber was actually Mike’s cousin Kevin, who had just come from a terrible costume party dressed as a ninja. Instead of arresting him, Mike ended up buying everyone donuts while the cashier took photos for social media.',
      'By the end of the night, the donut shop introduced a new special called “The Criminal Combo.”',
    ],
  },
  {
    id: 'smartest-escape-plan',
    title: 'The Smartest Escape Plan',
    paragraphs: [
      'Robber Danny believed he had created the greatest escape plan in history. He carefully studied maps, watched action movies, and even practiced dramatic running in front of the mirror.',
      'His plan was simple: rob the grocery store, jump on a bicycle stashed nearby, and disappear into the night before the police arrived.',
      'Everything went perfectly until Danny reached the bicycle and realized he had accidentally locked it himself earlier that morning. In panic, he tried opening the lock with a banana from the grocery bag because movies had taught him absolutely nothing useful.',
      'Officer Sarah arrived at the scene and found Danny arguing with the bicycle while three confused pigeons watched nearby.',
      'Sarah laughed so hard that she nearly forgot to arrest him.',
    ],
  },
  {
    id: 'courtroom-disaster-day',
    title: 'Courtroom Disaster Day',
    paragraphs: [
      'The city courtroom was completely packed because everyone wanted to watch the famous “Comedy Trial” featuring Officer Tom and robber Billy.',
      'Tom prepared serious evidence, dramatic speeches, and a long explanation about why Billy had stolen twenty garden flamingos from local houses.',
      'Billy stood up confidently and explained that he only wanted to build “the world’s first flamingo army.”',
      'The judge tried to stay serious, but things became impossible after Billy demonstrated military flamingo formations using ketchup bottles from his lunch tray.',
      'Even Officer Tom started laughing when Billy shouted, “The pink birds were supposed to protect the city!”',
      'The judge finally gave up and sentenced Billy to community service at the local zoo.',
    ],
  },
  {
    id: 'getaway-goat',
    title: 'The Getaway Goat',
    paragraphs: [
      'A robber named Leo needed a fast escape vehicle, but his car broke down minutes before the robbery. While panicking near a farm, he noticed a goat staring directly at him.',
      'For some reason, Leo decided the goat looked trustworthy.',
      'After stealing a bag full of snacks from a convenience store, Leo jumped onto the goat and yelled, “Go, my noble beast!”',
      'The goat moved exactly two steps before eating flowers beside the road.',
      'Officer Jenny caught up easily and spent the next ten minutes trying not to laugh while Leo unsuccessfully attempted to motivate the goat with potato chips.',
      'The goat eventually became famous online and received more followers than both Leo and the police department combined.',
    ],
  },
  {
    id: 'worlds-loudest-robber',
    title: 'The World’s Loudest Robber',
    paragraphs: [
      'Most robbers try to stay quiet. Unfortunately, robber Nick loved singing more than surviving.',
      'During a late-night robbery attempt at a small electronics store, Nick began singing dramatic opera music while searching for expensive headphones.',
      'The problem was that his singing echoed through the entire shopping center.',
      'Officer Ben arrived within minutes because several people had called the police to complain about “a very emotional ghost concert.”',
      'When Ben entered the store, Nick was standing on a table singing into a hair dryer like it was a microphone.',
      'Ben waited politely until the song ended before arresting him.',
      'To this day, people still remember Nick as “The Karaoke Criminal.”',
    ],
  },
  {
    id: 'fake-mustache-mystery',
    title: 'The Fake Mustache Mystery',
    paragraphs: [
      'Officer Linda spent three weeks searching for a mysterious robber who always escaped successfully. Every witness described the same thing: a man with a giant fake mustache.',
      'One afternoon, Linda stopped at a coffee shop and immediately noticed a suspicious man sitting near the counter. His mustache was crooked, obviously fake, and slowly falling into his soup.',
      'Linda carefully approached him, but before she could say anything, the mustache completely detached and landed inside the bowl.',
      'The entire café went silent.',
      'The robber looked around nervously and whispered, “This is not what it looks like.”',
      'Linda laughed so hard that she accidentally snorted coffee through her nose.',
      'The robber surrendered immediately because he was “too embarrassed to continue the crime life.”',
    ],
  },
  {
    id: 'jury-wanted-snacks',
    title: 'The Jury That Wanted Snacks',
    paragraphs: [
      'During a party game courtroom trial, Officer Chris and robber Jake competed by telling jokes to impress the jury.',
      'Chris told clever police jokes. Jake performed dramatic robber stories while pretending to faint every thirty seconds for extra attention.',
      'But the jury members barely listened because someone had brought a giant bowl of nachos into the room.',
      'Every time Chris told a joke, the jury simply nodded while eating chips loudly. Jake even tried stealing the nachos to gain attention, but the jury booed him immediately.',
      'In the final vote, the jury announced that the true star of the night was “whoever ordered the snacks.”',
      'Chris and Jake stopped arguing and spent the rest of the evening eating nachos together while planning a rematch.',
    ],
  },
];

export const getStoryPreview = (story: Story) => {
  const firstParagraph = story.paragraphs[0];
  return `${firstParagraph.slice(0, 108)} ....`;
};
