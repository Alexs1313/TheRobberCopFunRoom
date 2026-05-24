export type JokeSide = 'stellar' | 'comet';

export type Joke = {
  id: string;
  side: JokeSide;
  text: string;
};

export type Story = {
  id: string;
  title: string;
  paragraphs: string[];
};

export type GameRole = 'host' | 'guest';

export type GameComedian = {
  name: string;
  role: GameRole;
};
