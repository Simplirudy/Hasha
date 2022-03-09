import { useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { walletState } from '../../state/wallet/walletSlice';

import { ethers, Wallet, providers } from 'ethers';
import Moralis from 'moralis/dist/moralis.min.js';
import { connect } from '@textile/tableland';

import { Box, Text, Input, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const wallet = useSelector(walletState);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');

  async function createUser(tableName, user) {
    const privateKey =
      'b4438df26e4c7369368fe58f721d7e2f985e9915bd80091e9bcdeffc22107932';
    const wallet = new Wallet(privateKey);

    const provider = new providers.AlchemyProvider(
      'rinkeby',
      `K_Xt9OWBDy2ZXJyBVbBRmAlMLErENrkP`
    );
    const signer = wallet.connect(provider);
    const tbl = await connect({ network: 'testnet', signer });

    console.log('user Info', user);

    const userResponse = await tbl.query(
      `INSERT INTO ${tableName} (username, address, registered, level, xp, games_played, wins, losses) VALUES ('${user.username}', '${user.address}', '${user.registered}', ${user.level}, ${user.xp}, ${user.games_played}, ${user.wins}, ${user.losses});`
    );

    navigate('/');
    window.location.reload();
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const username = e.target[0].value;
    const wallet = e.target[1].value;

    await createUser('hasha_users_1_337', {
      username: username,
      address: wallet,
      // registered: new Date().toString(),
      registered: Date.now().toString(),
      level: 1,
      xp: 0,
      games_played: 0,
      wins: 0,
      losses: 0,
    });
  }

  return (
    <>
      <div className="flex h-screen">
        <div className="m-auto text-center space-y-5">
          <h2 className="text-4xl font-semibold">Hasha</h2>
          <h2 className="text-center text-2xl font-semibold">Sign Up</h2>
          <Box margin="0 auto" w={'25rem'}>
            <form onSubmit={(e) => handleSubmit(e)}>
              <Text mb="8px">Username</Text>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                isRequired
              />
              <Text my="8px">Wallet Address</Text>
              <Input value={wallet} isRequired isDisabled />
              <Button my="8px" type="submit">
                Sign Up
              </Button>
            </form>
          </Box>
        </div>
      </div>
    </>
  );
}
