import { ethers, Wallet, providers } from 'ethers';
import { connect } from '@textile/tableland';

export default async function queryUser(tableName, USER_ADDRESS) {
  
  try {
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
    } = await tbl.query(
      `SELECT * FROM ${tableName} WHERE ADDRESS = '${USER_ADDRESS}';`
    );

    return rows;
  } catch (err) {
    console.log(err)
  }
}
