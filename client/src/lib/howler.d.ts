declare module 'howler' {
  export interface HowlOptions {
    src?: string | string[];
    volume?: number;
    html5?: boolean;
    loop?: boolean;
    preload?: boolean;
    autoplay?: boolean;
    mute?: boolean;
    sprite?: { [key: string]: [number, number] };
    rate?: number;
    pool?: number;
    onload?: () => void;
    onloaderror?: () => void;
    onplay?: () => void;
    onend?: () => void;
    onpause?: () => void;
    onstop?: () => void;
    onmute?: () => void;
    onvolume?: () => void;
    onrate?: () => void;
    onseek?: () => void;
    onfade?: () => void;
  }

  export class Howl {
    constructor(options: HowlOptions);
    play(spriteOrId?: string | number): number;
    pause(id?: number): Howl;
    stop(id?: number): Howl;
    mute(muted?: boolean, id?: number): Howl | boolean;
    volume(vol?: number, id?: number): Howl | number;
    fade(from: number, to: number, duration: number, id?: number): Howl;
    rate(rate?: number, id?: number): Howl | number;
    seek(seek?: number, id?: number): Howl | number;
    loop(loop?: boolean, id?: number): Howl | boolean;
    state(): string;
    duration(id?: number): number;
    unload(): Howl;
    on(event: string, fn: () => void, id?: number): Howl;
    once(event: string, fn: () => void, id?: number): Howl;
    off(event: string, fn?: () => void, id?: number): Howl;
    load(): Howl;
    playing(id?: number): boolean;
  }

  export class Howler {
    static mute(muted?: boolean): boolean | void;
    static volume(vol?: number): number | void;
    static stop(): void;
  }
}
