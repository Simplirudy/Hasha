import { useEffect, useState } from 'react';

import { ethers, Wallet, providers } from 'ethers';
import Moralis from 'moralis/dist/moralis.min.js';
import { connect } from '@textile/tableland';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { setAccount, accountState } from '../../state/account/accountSlice';
import { walletState } from '../../state/wallet/walletSlice';
import { tableState } from '../../state/table/tableSlice';

// Components
import {
  Box,
  Button,
  Input,
  Text,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
} from '@chakra-ui/react';

const mime = require('mime-types');

export default function Inventory() {
  const account = useSelector(accountState);
  const wallet = useSelector(walletState);

  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    getNfts();
    console.log('Inventory');
  }, []);

  async function getNfts() {
    const response = await fetch(
      `https://api.nftport.xyz/v0/accounts/${wallet}?chain=polygon&page_size=25`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: '539632bf-b23e-47bb-8d74-de3bc55f14dd',
        },
      }
    );
    const data = await response.json();

    console.log('getNfts Inventory', data);
    setNfts(data.nfts);
  }

  return (
    <div className="pt-40">
      <div className="grid overflow-hidden grid-cols-3 gap-10">
        {nfts.length > 0 &&
          nfts.map((nft, idx) => {
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
                <>
                  <div key={idx} className="p-5 bg-gray-800 mx-auto">
                    <img src={`${nft.file_url}`} alt={nft.name} />
                  </div>
                </>
              );
            }

            return null;
          })}
      </div>
    </div>
  );
}
