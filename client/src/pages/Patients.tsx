import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Space, message, DatePicker, Input, Drawer, Form, Select } from 'antd';
import { PlusOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';
import type { TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import moment from 'moment';
import { usePatientService, Patient } from '../api/patientService';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface TableParams {
  pagination: TablePaginationConfig;
  sortField: string | null;
  sortOrder: string | null;
  filters: Record<string, any>;
}

const PatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
    sortField: null,
    sortOrder: null,
    filters: {},
  });
  const [isFilterDrawerVisible, setIsFilterDrawerVisible] = useState<boolean>(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { getPatients, loading, error } = usePatientService();

  useEffect(() => {
    fetchPatients();
  }, [JSON.stringify(tableParams)]); // Deep comparison of tableParams

  const fetchPatients = async () => {
    try {
      const { pagination, sortField, sortOrder, filters } = tableParams;
      const res = await getPatients({
        page: pagination.current,
        pageSize: pagination.pageSize,
        sortField: sortField || undefined,
        sortOrder: sortOrder as 'ASC' | 'DESC' | undefined,
        filters: {
          name: filters.name,
          contact1: filters.contact,
          panNo: filters.panNo,
          gender: filters.gender,
          admissionDateStart: filters.admissionDateStart,
          admissionDateEnd: filters.admissionDateEnd,
          surgeryDateStart: filters.surgeryDateStart,
          surgeryDateEnd: filters.surgeryDateEnd,
        },
      });
      
      if (Array.isArray(res)) {
        setPatients(res);
        setTableParams({
          ...tableParams,
          pagination: {
            ...pagination,
            total: res.length, // Assuming the API returns the total count
          },
        });
      } else if (res && 'patients' in res && 'totalCount' in res) {
        setPatients(res.patients);
        setTableParams({
          ...tableParams,
          pagination: {
            ...pagination,
            total: res.totalCount,
          },
        });
      } else {
        message.error('Unexpected response format');
      }
    } catch (err) {
      console.error('Error fetching patients:', err);
      message.error('Failed to fetch patients');
    }
  };

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<Patient> | SorterResult<Patient>[]
  ) => {
    const sortField = Array.isArray(sorter) ? sorter[0].field : sorter.field;
    const sortOrder = Array.isArray(sorter) 
      ? sorter[0].order === 'ascend' ? 'ASC' : 'DESC'
      : sorter.order === 'ascend' ? 'ASC' : 'DESC';
  
    setTableParams({
      pagination,
      filters: tableParams.filters, // Preserve existing filters
      sortField: sortField as string,
      sortOrder: sortOrder,
    });
  };

  const handleFilterSubmit = (values: any) => {
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: 1, // Reset to first page when applying new filters
      },
      filters: {
        name: values.name,
        contact: values.contact,
        panNo: values.panNo,
        gender: values.gender,
        admissionDateStart: values.admissionDateRange?.[0]?.format('YYYY-MM-DD'),
        admissionDateEnd: values.admissionDateRange?.[1]?.format('YYYY-MM-DD'),
        surgeryDateStart: values.surgeryDateRange?.[0]?.format('YYYY-MM-DD'),
        surgeryDateEnd: values.surgeryDateRange?.[1]?.format('YYYY-MM-DD'),
      },
    });
    setIsFilterDrawerVisible(false);
  };

  const handleAddPatient = () => {
    navigate('/patients/add');
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      render: (text: string, record: Patient) => <a onClick={() => navigate(`/patients/${record.id}`)}>{text}</a>,
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      sorter: true,
    },
    {
      title: 'Contact',
      dataIndex: 'contact1',
      key: 'contact1',
    },
    {
      title: 'PAN',
      dataIndex: 'panNo',
      key: 'panNo',
    },
    {
      title: 'Admission Date',
      dataIndex: 'admissionDate',
      key: 'admissionDate',
      sorter: true,
      render: (date: string) => moment(date).format('YYYY-MM-DD'),
    },
    {
      title: 'Surgery Date',
      dataIndex: 'surgeryDate',
      key: 'surgeryDate',
      sorter: true,
      render: (date: string) => moment(date).format('YYYY-MM-DD'),
    },
  ];

  return (
    <div className="p-6">
      <Space className="mb-4 flex justify-between">
        <h1 className="text-2xl font-bold">Patients</h1>
        <Space>
          <Button 
            icon={<FilterOutlined />} 
            onClick={() => setIsFilterDrawerVisible(true)}
          >
            Filters
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAddPatient}
          >
            Add Patient
          </Button>
        </Space>
      </Space>
      
      <Table<Patient>
        columns={columns}
        dataSource={patients}
        rowKey="id"
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
      />

      <Drawer
        title="Filter Patients"
        placement="right"
        onClose={() => setIsFilterDrawerVisible(false)}
        open={isFilterDrawerVisible}
        width={400}
      >
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleFilterSubmit}
          initialValues={tableParams.filters}
        >
          <Form.Item name="name" label="Name">
            <Input prefix={<SearchOutlined />} placeholder="Search by name" />
          </Form.Item>
          <Form.Item name="contact" label="Contact">
            <Input prefix={<SearchOutlined />} placeholder="Search by contact" />
          </Form.Item>
          <Form.Item name="panNo" label="PAN Number">
            <Input prefix={<SearchOutlined />} placeholder="Search by PAN" />
          </Form.Item>
          <Form.Item name="gender" label="Gender">
            <Select placeholder="Select gender" allowClear>
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
              <Option value="Third Gender">Third Gender</Option>
            </Select>
          </Form.Item>
          <Form.Item name="admissionDateRange" label="Admission Date Range">
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="surgeryDateRange" label="Surgery Date Range">
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Apply Filters
              </Button>
              <Button onClick={() => {
                form.resetFields();
                handleFilterSubmit({});
              }}>
                Reset
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default PatientsPage;