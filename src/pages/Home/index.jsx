// Redux
import { useSelector } from 'react-redux';
import { accountState } from '../../state/account/accountSlice';

// React Router
import { useNavigate, Link } from 'react-router-dom';

import { Button } from '@chakra-ui/react';
import { useEffect } from 'react';

export default function Home() {
  const account = useSelector(accountState);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(account);
    if (!account) {
      navigate('/');
    }
  }, []);

  return (
    <div className="flex justify-between mx-auto w-1/2">
      <div className="space-y-5">
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
        <div className="text-center">
          <Button size="lg" w={60}>
            Change Mode
          </Button>
        </div>
      </div>
    </div>
  );
}
