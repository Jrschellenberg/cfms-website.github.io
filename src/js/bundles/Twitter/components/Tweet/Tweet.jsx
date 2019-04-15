import { h } from 'preact';
import Skeleton from 'preact-loading-skeleton';

import './Tweet.scss';

const delimiter = '…';

export const Tweet = ({loading, user, retweeted_status, id_str, text}) => {
  if(loading){
    return(
      <div className="Tweet skeleton">
        <Skeleton count={2} />
      </div>
    )
  }

  const tweetText = retweeted_status ? retweeted_status.text : text;
  const parts = tweetText.split(delimiter);
  const tweet = parts[0].trim() + delimiter;
  const link = parts[1].trim();
    
  
  return (
    <div className={`Tweet`}>
      <a target="_blank" href={link}>{tweet}</a>
    </div>  
  )
}
