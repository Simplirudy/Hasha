import { useState } from 'react';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { setAccount, accountState } from '../../state/account/accountSlice';
import { walletState } from '../../state/wallet/walletSlice';
import { tableState } from '../../state/table/tableSlice';

// React Router
import { useNavigate, Link } from 'react-router-dom';

import { ethers, Wallet, providers } from 'ethers';
import { connect } from '@textile/tableland';

import {
  Button,
  Avatar,
  AvatarBadge,
  AvatarGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  Box,
  Image,
} from '@chakra-ui/react';
import { useEffect } from 'react';

const mime = require('mime-types');

export default function Home() {
  // Redux
  const dispatch = useDispatch();
  const account = useSelector(accountState);
  const wallet = useSelector(walletState);
  const tableId = useSelector(tableState);

  const navigate = useNavigate();

  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    getNfts();
  }, []);

  useEffect(() => {
    console.log(account);

    if (!wallet) {
      navigate('/connect');
    } else if (!account) {
      navigate('/');
    }
  });

  async function getNfts() {
    const response = await fetch(
      `https://api.nftport.xyz/v0/accounts/${wallet}?chain=polygon&page_size=10`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: '539632bf-b23e-47bb-8d74-de3bc55f14dd',
        },
      }
    );
    const data = await response.json();

    console.log('getNfts', data);
    setNfts(data.nfts);
  }

  async function changeAvatar(tableName, nftLink) {
    const privateKey = process.env.REACT_APP_WALLET_PRIVATE_KEY;
    const wallet = new Wallet(privateKey);

    const provider = new providers.AlchemyProvider(
      'rinkeby',
      `K_Xt9OWBDy2ZXJyBVbBRmAlMLErENrkP`
    );

    const signer = wallet.connect(provider);
    const tbl = await connect({ network: 'testnet', signer });

    const response = await tbl.query(
      `UPDATE ${tableName} SET avatar = '${nftLink}' WHERE ADDRESS = '${account.wallet}';`
    );

    //window.location.reload();
    dispatch(
      setAccount({
        ...account,
        avatar: nftLink,
      })
    );
  }

  if (!account) return null;

  return (
    <div className="flex justify-between mx-auto items-center w-1/2">
      <div className="space-y-5 flex flex-col">
        <Avatar
          width="300px"
          height="300px"
          name="John Smith"
          src={account.avatar}
          className="mx-auto"
        />
        <Box className="text-center">
          <Popover placement="bottom">
            <PopoverTrigger>
              <Button colorScheme="red">Change</Button>
            </PopoverTrigger>
            <PopoverContent color="white" bg="blue.800" borderColor="blue.800">
              <PopoverHeader pt={4} fontWeight="bold" border="0">
                Change Your NFT Avatar
              </PopoverHeader>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverBody>
                <div className="grid grid-cols-3 space-x-10">
                  <div>
                    <button
                      onClick={() =>
                        changeAvatar(tableId, '/img/avatar/default.png')
                      }
                    >
                      <Avatar
                        size="2xl"
                        src={`/img/avatar/default.png`}
                        alt="default avatar"
                      />
                    </button>
                  </div>
                  {nfts.map((nft, idx) => {
                    const mimeType = mime.lookup(nft.file_url);

                    console.log('mimeType', mimeType);

                    if (nft.file_url && mimeType === 'image/png') {
                      if (nft.file_url.startsWith('ipfs://')) {
                        nft.file_url = nft.file_url.replace(
                          'ipfs://',
                          'https://ipfs.io/ipfs/'
                        );
                      }
                      return (
                        <div key={idx}>
                          <button
                            onClick={() => changeAvatar(tableId, nft.file_url)}
                          >
                            <Avatar
                              size="2xl"
                              src={`${nft.file_url}`}
                              alt={nft.name}
                            />
                          </button>
                        </div>
                      );
                    }

                    return null;
                  })}
                </div>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Box>

        {account && (
          <ul>
            <li className="font-semibold">{account.username}</li>
            <li>Address: {account.wallet}</li>
            <li>Level: {account.level}</li>
            <li>XP: {account.xp}</li>
          </ul>
        )}
      </div>
      <div className="space-y-5">
        <div className="text-center">
          <Button
            size="lg"
            colorScheme="blue"
            w={60}
            onClick={() => navigate('/play')}
          >
            Play
          </Button>
        </div>
      </div>
    </div>
  );
}
