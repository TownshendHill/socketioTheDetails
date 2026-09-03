/* Data Transfer Objects — the shapes that actually cross the wire.
   Plain data only, no methods: Socket.IO serialises to JSON, and JSON keeps
   values but drops behaviour. Server classes `implements` these, so the two
   cannot drift apart.

   The types are declared globally rather than exported. The browser files are
   classic <script> tags sharing one scope, so an `import` in any of them would
   turn it into a module and break that sharing. `declare global` lets the
   server's module files see them too. */

export {}; // makes this a module, so `declare global` is allowed

type Last<T extends readonly unknown[]> = T extends [...unknown[], infer L] ? L : never;
type AllButLast<T extends readonly unknown[]> = T extends [...infer H, unknown] ? H : [];
type FirstArg<T> = T extends (arg: infer A) => unknown ? A : never;

declare global {
    interface OrbData {
        color: string;
        locX: number;
        locY: number;
        radius: number;
    }

    interface PlayerDataDto {
        name: string;
        locX: number;
        locY: number;
        radius: number;
        color: string;
        score: number;
        orbsAbsorbed: number;
        playersAbsorbed: number;
    }

    /** The event contract. Each entry is the signature of that event's HANDLER;
        Socket.IO derives the emit signature from its parameters. An
        acknowledgement is declared as the LAST parameter. */
    interface ClientToServerEvents {
        init: (playerObj: { playerName: string }, ack: (res: { orbs: OrbData[] }) => void) => void;
    }

    interface ServerToClientEvents {
        tick: (players: PlayerDto[]) => void;
    }

    /** The browser gets `io` from a <script> tag, not an import, so the client
        socket is described here instead of coming from socket.io-client types.
        Emit args and handler params are derived from the two event maps above. */
    interface ClientSocket {
        emitWithAck<Ev extends keyof ClientToServerEvents>(
            ev: Ev,
            ...args: AllButLast<Parameters<ClientToServerEvents[Ev]>>
        ): Promise<FirstArg<Last<Parameters<ClientToServerEvents[Ev]>>>>;
        emit<Ev extends keyof ClientToServerEvents>(
            ev: Ev,
            ...args: Parameters<ClientToServerEvents[Ev]>
        ): void;
        on<Ev extends keyof ServerToClientEvents>(
            ev: Ev,
            listener: ServerToClientEvents[Ev],
        ): void;
    }

    /** One entry of the `tick` payload. Only playerData crosses the wire —
        playerConfig is server-side only. */
    interface PlayerDto {
        playerData: PlayerDataDto;
    }
}
