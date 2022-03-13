import { useEffect, useState } from 'react';

import { ethers, Wallet, providers } from 'ethers';
import Moralis from 'moralis/dist/moralis.min.js';
import { connect } from '@textile/tableland';

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

export default function Players() {
  const [allPlayers, setAllPlayers] = useState([]);

  async function queryAllUsers(tableName) {
    const privateKey =
      'b4438df26e4c7369368fe58f721d7e2f985e9915bd80091e9bcdeffc22107932';
    const wallet = new Wallet(privateKey);

    const provider = new providers.AlchemyProvider(
      'rinkeby',
      `K_Xt9OWBDy2ZXJyBVbBRmAlMLErENrkP`
    );
    const signer = wallet.connect(provider);
    const tbl = await connect({ network: 'testnet', signer });

    // Read user data
    const {
      data: { rows, columns },
    } = await tbl.query(`SELECT * FROM ${tableName};`);

    console.log('query data', rows);

    let items = rows.map((row, index) => {
      const obj = {};

      // add property keys and values
      for (const [index, value] of row.entries()) {
        if (columns[index].name == 'registered') {
          // format date
          const date = new Date(Number(value));
          obj[
            columns[index].name
          ] = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
        } else {
          obj[columns[index].name] = value;
        }
      }

      return obj;
    });

    setAllPlayers(items);
  }

  useEffect(() => {
    queryAllUsers('hasha_users_1_337');
  }, []);

  return (
    <>
      {allPlayers.length > 0 && (
        <Table variant="striped" colorScheme="red">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Username</Th>
              <Th>Wallet</Th>
              <Th>Registered</Th>
              <Th>Level</Th>
              <Th>XP</Th>
              <Th>Games Played</Th>
              <Th>Wins</Th>
              <Th>Losses</Th>
            </Tr>
          </Thead>
          <Tbody>
            {allPlayers.map((row, idx) => {
              const keys = Object.keys(allPlayers[0]);

              return (
                <Tr key={idx}>
                  {keys.map((key, idx) => (
                    <Td key={idx}>{row[key]}</Td>
                  ))}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      )}
    </>
  );
}
