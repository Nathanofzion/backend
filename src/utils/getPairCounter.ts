
import { Mercury } from 'mercury-sdk';
import { factoryInstanceParser } from './parsers/factoryInstanceParser';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { GET_LAST_CONTRACT_ENTRY } from './queries/getLastContractEntry';
import { getFactoryAddress } from './getFactoryAddress';

/**
 * Function to get the total number of pairs created by the factory.
 * @param mercuryInstance The Mercury instance to be used to make the request.
 * @returns The total number of pairs created by the factory.
 * @throws Error if Mercury request fails.
 */
export async function getPairCounter(mercuryInstance:Mercury) {
    const contractId = await getFactoryAddress();
    const mercuryResponse = await mercuryInstance.getCustomQuery({ request: GET_LAST_CONTRACT_ENTRY, variables: { contractId, ledgerKey: "AAAAFA==" } })
    .catch((err: any) => {
        console.log(err)
    })

    if (mercuryResponse && mercuryResponse.ok) {
        const parsedEntry = factoryInstanceParser(mercuryResponse.data);
        if (parsedEntry.length === 0) {
            return 0;
        }
        return parsedEntry[0].totalPairs;
    } else {
        throw new Error("Error getting pair counter")
    }
    
}