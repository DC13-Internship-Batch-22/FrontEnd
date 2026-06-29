import React from 'react';
import { Table, Button, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Food } from '../../types/food';

interface MenuTableProps {
  data: Food[];
  loading: boolean;
  onEdit: (item: Food) => void;
  onDelete: (item: Food) => void;
}

const MenuTable: React.FC<MenuTableProps> = ({ data, loading, onEdit, onDelete }) => {
  const columns = [
    {
      title: 'ITEM',
      key: 'item',
      render: (record: Food) => (
        <div className="flex items-center gap-4">
          <img src={record.imageUrl} className="w-12 h-12 rounded-lg object-cover shadow-sm" alt={record.name} />
          <div>
            <div className="font-bold text-gray-800">{record.name}</div>
            <div className="text-xs text-gray-400">ID: {record.id}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'CATEGORY',
      dataIndex: 'categoryName',
      render: (cat: string) => (
        <span className="px-2 py-1 bg-blue-50 text-blue-500 rounded text-[10px] font-bold uppercase">
          {cat || 'N/A'}
        </span>
      ),
    },
    {
      title: 'PRICE',
      dataIndex: 'price',
      render: (price: number) => <span className="font-medium">${price.toFixed(2)}</span>,
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      render: (status: string) => (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-600">
          ● {status}
        </span>
      ),
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      render: (record: Food) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined className="text-gray-400 hover:text-blue-500" />} onClick={() => onEdit(record)} />
          <Button type="text" icon={<DeleteOutlined className="text-gray-400 hover:text-red-500" />} onClick={() => onDelete(record)} />
        </Space>
      ),
    },
  ];

  return <Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={{ pageSize: 5 }} />;
};

export default MenuTable;