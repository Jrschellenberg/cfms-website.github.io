import { h, Component } from 'preact';
import BackendClient from '../../services/BackendClient';
import Settings from '../Settings/Settings';
import Environment from '../../environment/Environment';


import './App.scss';

const backendRequests = BackendClient.getInstance();

class App extends Component {
  state = {
    loading: true,
    tweets: []
  }
  
  async componentDidMount() {
    console.log("Ever hit Here?");
    const initialTweetsArray = [];
    
    for(let i =0; i<3; i++) {
      initialTweetsArray.push('value');
    }
    
    this.setState({
      tweets: initialTweetsArray // giving it values So we can map over Tweet Skeletons
    });
    
    try{
      const resp = await backendRequests.getTweets();
      
      console.log("Response is ", resp);
      
      // this.setState({
      //   relatedProducts: resp.data.products,
      //   loading: false
      // });
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
          <a href="https://twitter.com/cfmsfemc"><h1>@CFMSFEMC</h1></a>
        </div>
        <div className="icon"><i className="fa fa-twitter" /></div>
        
        <div className="TweetsContainer">
          {tweets.map((tweet, i) => {
            return <h1>Hello World</h1>
          })}
        </div>
      </div>
    );
  }
}

export default App;