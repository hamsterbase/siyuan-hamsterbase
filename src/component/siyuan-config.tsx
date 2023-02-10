import { Button, Form, Input, message } from 'antd';
import React, { useContext, useState } from 'react';
import { Context } from '../context';
import { SiyuanServiceConfig } from '../services/siyuan';
import { useSiyuanState } from '../store/status';
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const SiyuanConfig: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const siyuanState = useSiyuanState();

  const ctx = useContext(Context)!;

  const [config, SetConfig] = useState<SiyuanServiceConfig>(
    ctx.siyuanService.config
  );

  const [showError] = useState(false);

  const handleClick = () => {
    ctx.siyuanService.updateSiyuanConfig(config);
    ctx.siyuanService.isAccessAble().then((res) => {
      if (!res) {
        messageApi.error('invalid token');
      }
      siyuanState.setSiyuanAccessAble(res);
    });
  };

  return (
    <div>
      {contextHolder}

      <Form
        {...layout}
        initialValues={config}
        onValuesChange={(value) => SetConfig((old) => ({ ...old, ...value }))}
      >
        <Form.Item
          name="origin"
          label="SiYuan Origin"
          rules={[{ required: true }]}
        >
          <Input placeholder="SiYuan Origin"></Input>
        </Form.Item>
        <Form.Item
          name="token"
          label="Siyuan Token"
          rules={[{ required: true }]}
          status={showError ? 'error' : 'success'}
        >
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button onClick={handleClick}>Check</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export { SiyuanConfig };
