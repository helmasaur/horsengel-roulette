import { 
    Message, 
    Guild, 
    GuildMember, 
    TextChannel, 
    RichEmbed 
} from 'discord.js';

interface LocaleStrings {
  [key: string]: string | LocaleStrings;
}

export default class HorsengelRoulette<P1 extends GuildMember, P2 extends GuildMember> {
    public bot: GuildMember;
    public channel: TextChannel;
    public guild: Guild;
    public players: [P1, P2];
    public revolver: number[];
    public revolverString: string;
    public strings: LocaleStrings;
    public maxTimePlayerAnswer: number;
    public timeBotAnswer: number;

    public constructor(
        msg: Message, 
        player1: P1, 
        player2: P2, 
        public prefix: string, 
        language: string
    );

    public load(magazine: number, bullets: number): void;
    public async start(): Promise<Message | GuildMember>;
    public async game(): Promise<Message | GuildMember>;
    public async kick(
        player: P1 | P2, 
        description: string
    ): Promise<Message | GuildMember>;
    public async sleep(): Promise<void>;
    public embedRound(
        round: number, 
        description: string, 
        gameOver?: boolean
    ): RichEmbed;
    public embedKick(kicked: P1 | P2, reason: string): RichEmbed;
}