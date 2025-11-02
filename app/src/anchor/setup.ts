

import type { CipherValut } from "../../../target/types/cipher_valut";
import idl from "../../../target/idl/cipher_valut.json";
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


