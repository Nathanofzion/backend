import { Network } from '@prisma/client';
import { TokenType, getTokensList } from './getTokensList';

export async function getTokenData(
  network: Network,
  token: string,
): Promise<TokenType> {
  const tokens = await getTokensList(network);
  const currentToken = tokens.find((item) => item.contract === token);
  console.log('🚀 « currentToken:', currentToken);

  if (!currentToken) {
    return {
      code: token,
      name: token,
      contract: token,
    };
  }
  return currentToken;
}
