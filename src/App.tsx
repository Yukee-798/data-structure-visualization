import { Layout } from 'antd';
import RouterView from './router';
import './App.scss';

const { Header, Content, Footer } = Layout;
function App() {
  return (
    <div className="App">
      <Layout className='layout'>
        <Header className='header'>

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
