import {
    Router,
    Route,
    TabRouter
} from '@areslabs/router' 

import BleTest from './BleTest'
import ManualScreen from './ManualScreen'
import AutoLive from './AutoLive'
import DownloadLive from './DownloadLive'
import CustomExp from './CustomExp'

class RinaControl extends Component{
    render() {
        return (
            <Router>
                <TabRouter>
                    <Route key="配网" component={BleTest}/>
                    <Route key="手动" component={ManualScreen}/> 
                    <Route key="Live" component={AutoLive}/>
                    <Route key="下载资源" component={DownloadLive}/> 
                    <Route key="自定义表情" component={CustomExp}/> 
                </TabRouter>
            </Router>
        )
    }
}