import {useEffect} from 'react';
import {useNavigate, useParams} from 'react-router';

const Index = () => {
  const params = useParams<{serverName: string}>();
  const serverName = params.serverName;
  const navigate = useNavigate();
  useEffect(() => {
    navigate(`/server/${serverName}/general`);
  }, [navigate, serverName]);
  return null;
};

export default Index;
