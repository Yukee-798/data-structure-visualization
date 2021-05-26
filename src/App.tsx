import { Layout } from 'antd';
import RouterView from './configs/router';
import './App.scss';
const { Header, Content, Footer } = Layout;
function App() {
  return (
    <div className="App">
      <Layout className='layout'>
        <Header className='header'>
          <a href="/data-structure-visualization/">Data Structure Visualization</a>
        </Header>
        <Content className='content'>
          <RouterView />
        </Content>
        <Footer className='footer'>
          DSV DC ©2021 Created by 孔磊 and 亢江林
        </Footer>
      </Layout>
    </div>
  );
}
export default App;

