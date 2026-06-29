import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, Button, Upload } from 'antd';
import type { DishPayload, Food, Category } from '../../types/food';
import { UploadOutlined } from '@ant-design/icons';

interface DishModalProps {
  open: boolean;
  mode: 'add' | 'edit';
  initialData: Food | null;
  categories: Category[];
  confirmLoading: boolean;
  onCancel: () => void;
  onSave: (values: DishPayload) => void;
}

const DishModal: React.FC<DishModalProps> = ({ open, mode, initialData, categories, confirmLoading, onCancel, onSave }) => {
  const [form] = Form.useForm();
  const [uploadType, setUploadType] = useState<'url' | 'file'>('file'); // Quản lý lựa chọn hình thức nhập ảnh

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData) {
        setUploadType('url'); // Khi edit thường hiển thị dạng URL ảnh có sẵn
        form.setFieldsValue({
          name: initialData.name,
          price: initialData.price,
          categoryId: initialData.categoryId,
          imageUrl: initialData.imageUrl,
          status: initialData.status,
        });
      } else {
        form.resetFields();
        setUploadType('file'); // Khi add mặc định chọn chọn file từ máy
        form.setFieldsValue({ status: 'AVAILABLE' });
      }
    }
  }, [open, mode, initialData, form]);

  const handleSubmit = () => {
    form.validateFields().then((values: any) => {
      // Nếu chọn hình thức upload file, bóc tách lấy file thực tế từ cấu trúc dữ liệu của Antd Upload
      if (uploadType === 'file' && values.imageUrl?.file) {
        values.imageUrl = values.imageUrl.file; // Gán lại thành đối tượng File thuần túy
      }
      onSave(values);
    });
  };

  return (
    <Modal
      title={<div className="text-lg font-bold border-b pb-2">{mode === 'add' ? 'Add New Dish' : 'Edit Dish'}</div>}
      open={open}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={confirmLoading} // Tích hợp hiệu ứng loading cho nút bấm chính của Modal
      okText={mode === 'add' ? 'Add Dish' : 'Save Changes'}
      cancelText="Cancel"
      okButtonProps={{ className: 'bg-blue-600' }}
      destroyOnClose
    >
      <Form form={form} layout="vertical" className="pt-4">
        <Form.Item
          name="name"
          label={<span className="font-semibold">Dish Name</span>}
          rules={[{ required: true, message: 'Please enter dish name!' }]}
        >
          <Input placeholder="e.g. Signature Wagyu Burger" className="rounded-lg" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="price"
            label={<span className="font-semibold">Price ($)</span>}
            rules={[{ required: true, message: 'Please enter price!' }]}
          >
            <InputNumber className="w-full rounded-lg" min={0} precision={2} />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label={<span className="font-semibold">Category</span>}
            rules={[{ required: true, message: 'Please select a category!' }]}
          >
            <Select placeholder="Select category">
              {categories.map((cat) => (
                <Select.Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <div className="mb-2 flex gap-4">
          <span className="font-semibold text-gray-600">Hình thức ảnh:</span>
          <label className="cursor-pointer flex items-center gap-1">
            <input type="radio" checked={uploadType === 'file'} onChange={() => setUploadType('file')} /> Upload File
          </label>
          <label className="cursor-pointer flex items-center gap-1">
            <input type="radio" checked={uploadType === 'url'} onChange={() => setUploadType('url')} /> Nhập URL Text
          </label>
        </div>

        {uploadType === 'url' ? (
          <Form.Item
            name="imageUrl"
            label={<span className="font-semibold">URL Hình ảnh</span>}
            rules={[{ required: true, message: 'Vui lòng nhập URL ảnh!' }]}
          >
            <Input placeholder="https://..." className="rounded-lg" />
          </Form.Item>
        ) : (
          <Form.Item
            name="imageUrl"
            label={<span className="font-semibold">Chọn file ảnh từ máy tính</span>}
            rules={[{ required: true, message: 'Vui lòng tải lên một file ảnh!' }]}
          >
            <Upload 
              maxCount={1} 
              listType="picture"
              beforeUpload={() => false} // Ngăn Antd tự động gửi request upload riêng lên server
            >
              <Button icon={<UploadOutlined />}>Bấm để chọn file ảnh</Button>
            </Upload>
          </Form.Item>
        )}

        <Form.Item name="status" label={<span className="font-semibold">Status</span>}>
          <Select className="w-full" disabled>
            <Select.Option value="AVAILABLE">AVAILABLE</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DishModal;
