import { Layout } from 'antd';
import RouterView from './configs/router';
import './App.scss';
const { Header, Content, Footer } = Layout;
function App() {
  return (
    <div className="App">
      <Layout className='layout'>
        <Header className='header'>
          <a href="/home">Data Structure Visualization</a>
        </Header>
        <Content className='content'>
          <RouterView />
        </Content>
        <Footer className='footer'>
          DSV DC ©2021 Created by Dora and Conan
        </Footer>
      </Layout>
    </div>
  );
}
export default App;

