import { Button, Form, Input } from 'antd';
import React from 'react';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const SyncPanel = () => {
  const [formValue, setValue] = React.useState<{
    endpoint?: string;
    apiToken?: string;
    folder?: string;
  }>({
    folder: 'hamsterbase/highlights',
  });

  const handleSync = () => {
    console.log(formValue);
  };

  return (
    <Form
      {...layout}
      name="control-ref"
      initialValues={formValue}
      onValuesChange={(value) => setValue((old) => ({ ...old, ...value }))}
    >
      <Form.Item
        name="endpoint"
        label="HamsterBase Endpoint"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="apiToken"
        label="HamsterBase API Token"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="folder"
        label="Highlights Folder"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" onClick={handleSync}>
          Sync
        </Button>
      </Form.Item>
    </Form>
  );
};

export { SyncPanel };
