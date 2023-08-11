"use client";
import { PageContainer, ProLayout } from '@ant-design/pro-components';
import { Button, Switch } from 'antd';
import { useRef, useState } from 'react';

const customMenuDate = [
  {
    path: '/',
    name: '欢迎',
    routes: [
      {
        path: '/welcome',
        name: 'one',
        routes: [
          {
            path: '/welcome/welcome',
            name: 'two',
            exact: true,
          },
        ],
      },
    ],
  },
  {
    path: '/demo',
    name: '例子',
  },
];

const waitTime = (time = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

let serviceData = customMenuDate;

export default () => {
  const actionRef = useRef({
    reload: () => {}
  });
  const [toggle, setToggle] = useState(false);
  return (
    <>
      <ProLayout
        style={{
          height: '100vh',
        }}
        actionRef={actionRef}
        layout = 'right'
        suppressSiderWhenMenuEmpty={toggle}
        menu={{
          request: async () => {
            await waitTime(2000);
            return serviceData;
          },
        }}
        location={{
          pathname: '/welcome/welcome',
        }}
      >
        <PageContainer content="欢迎使用">
          <div>
            当从服务器获取的菜单为空时隐藏Sider：
            <Switch checked={toggle} onChange={setToggle} />
          </div>
          Hello World
          <Button
            style={{
              margin: 8,
            }}
            onClick={() => {
              serviceData = customMenuDate;
              actionRef.current?.reload();
            }}
          >
            刷新菜单
          </Button>
          <Button
            style={{
              margin: 8,
            }}
            onClick={() => {
              serviceData = [];
              actionRef.current?.reload();
            }}
          >
            刷新菜单（空数据）
          </Button>
        </PageContainer>
      </ProLayout>
    </>
  );
};