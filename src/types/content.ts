export type JokeSide = 'police' | 'robber';

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

export type GameRole = 'officer' | 'robber';

export type GamePlayer = {
  name: string;
  role: GameRole;
};
