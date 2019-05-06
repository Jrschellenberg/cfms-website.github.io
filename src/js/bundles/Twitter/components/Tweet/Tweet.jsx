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
  
  let url;
  if(entities && entities.urls && entities.urls[0] && entities.urls[0].url) {
    url = entities.urls[0].url;
  }
  else if(retweeted_status && retweeted_status.entities && retweeted_status.entities.urls && retweeted_status.entities.urls[0] && retweeted_status.entities.urls[0].url ){
    url = retweeted_status.entities.urls[0].url;
  }
  else {
    url = 'https://twitter.com/CFMSFEMC';
  }
  
  const tweetText = retweeted_status ? retweeted_status.text : text;
  
  return (
    <div className={`Tweet`}>
      <a target="_blank" href={url}>{tweetText}</a>
    </div>  
  )
}
