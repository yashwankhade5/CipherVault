

import type { CipherValut } from "./ciphervault-types";
import idl from "./cipher_vault.json";
import { useMemo } from "react";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";



export const useProgram = () => {
    const { connection } = useConnection();
    const anchorWallet = useAnchorWallet();

    return useMemo(() => {
        if (!anchorWallet) return null;

        const provider = new AnchorProvider(
            connection,
            anchorWallet,
            AnchorProvider.defaultOptions()
        );

        return new Program(idl as CipherValut, provider) as Program<CipherValut>;
    }, [anchorWallet, connection]);
};


