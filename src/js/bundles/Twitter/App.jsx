import { h, Component } from 'preact';
import { SkeletonTheme } from "preact-loading-skeleton";

import BackendClient from '../../services/BackendClient';
import Settings from '../Settings/Settings';
import Environment from '../../environment/Environment';
import { Tweet } from './components';

import './App.scss';

const backendRequests = BackendClient.getInstance();

class App extends Component {
  state = {
    loading: true,
    tweets: []
  };
  
  async componentDidMount() {
    const initialTweetsArray = [];
    
    for(let i =0; i<3; i++) {
      initialTweetsArray.push('value');
    }
    
    this.setState({
      tweets: initialTweetsArray // giving it values So we can map over Tweet Skeletons
    });
    
    try{
      const resp = await backendRequests.getTweets();
      console.log("Resp is ", resp);
      
      if(resp.status !== 200){
        throw new Error(`Error occured while Retrieving Data from API with status of ${resp.status}`);
      }
      
      const tweets = resp.data.posts;
      this.setState({
        tweets: tweets,
        loading: false
      });
    }
    catch(err){
      console.error(`An Error occured while trying to obtain related products at the following api endpoint \n
       ${Environment.getBackendURL()}/tweets`, err);
    }
  }
  
  render() {
    const {loading, tweets} = this.state;
    
    return (
      <div className="TwitterWidget">
        <div className="twitterTitle">
          <h1>{Settings.getInstance().getData().twitterTitle}</h1>
          <span> : </span>
          <a className="twitterLink" href="https://twitter.com/cfmsfemc"><h1>@CFMSFEMC</h1></a>
        </div>
        <div className="icon"><i className="fa fa-twitter" /></div>
        
        <div className="TweetsContainer">
          <SkeletonTheme  color="#202020" highlightColor="#444" >
          {tweets.map((tweet, i) => {
            return <Tweet key={loading ? i : tweet.id } {...tweet} loading={loading} />
          })}
          </SkeletonTheme>
        </div>
      </div>
    );
  }
}

export default App;