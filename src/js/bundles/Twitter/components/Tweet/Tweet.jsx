import { h } from 'preact';
import Skeleton from 'preact-loading-skeleton';

import './Tweet.scss';

export const Tweet = ({loading, user, retweeted_status, id_str, text, truncated, entities}) => {
  if(loading){
    return(
      <div className="Tweet skeleton">
        <Skeleton count={2} />
      </div>
    )
  }
  
  const tweetText = retweeted_status ? retweeted_status.text : text;
  const url = entities && entities.urls && entities.urls[0] && entities.urls[0].url ? entities.urls[0].url : 'https://twitter.com/CFMSFEMC' ;

  
  return (
    <div className={`Tweet`}>
      <a target="_blank" href={url}>{tweetText}</a>
    </div>  
  )
}
