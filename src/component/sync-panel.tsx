import { Button, Form, Input, Select } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../context';
import { HamsterBaseConfig } from '../services/highlightsService';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const SyncPanel = () => {
  const ctx = useContext(Context)!;

  const [notebooks, setNotebooks] = useState<{ id: string; name: string }[]>(
    []
  );

  useEffect(() => {
    ctx.siyuanService.listNotebooks().then((re) => {
      setNotebooks(
        re.notebooks.map((p) => ({
          id: p.id,
          name: p.name,
        }))
      );
    });
  }, []);

  const [formValue, setValue] = React.useState<HamsterBaseConfig>(
    ctx.highlightsService.config
  );

  useEffect(() => {
    ctx.highlightsService.updateConfig(formValue);
  }, [formValue]);

  const handleSync = () => {
    ctx.highlightsService.sync();
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
        name="notebook"
        label="Siyuan Notebook"
        rules={[{ required: true }]}
      >
        <Select
          options={notebooks?.map((o) => ({
            value: o.id,
            label: o.name,
          }))}
        />
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
