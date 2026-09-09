import {useEffect} from 'react';
import {useNavigate, useParams} from 'react-router';

const Index = () => {
  // TODO : iF the Server Has A channel Redirect To First Channel in Server , when dont Have any Channel Show a Dialog to Generate One Or Generate A General Channel Automatically
  const params = useParams<{serverId: string}>();
  const serverId = params.serverId;
  const navigate = useNavigate();
  useEffect(() => {
    navigate(`server/${serverId}/general`);
  }, [navigate, serverId]);
  return null;
};

export default Index;
