import { Layout } from 'antd';
import RouterView from './configs/router';
import './App.scss';
import { root } from './configs/router/config';
const { Header, Content, Footer } = Layout;
function App() {
  return (
    <div className="App">
      <Layout className='layout'>
        <Header className='header'>
          <a href={root}>Data Structure Visualization</a>
        </Header>
        <Content className='content'>
          <RouterView />
        </Content>
        <Footer className='footer'>
          DSV ©2021 Created by Dora and Conan
        </Footer>
      </Layout>
    </div>
  );
}
export default App;

