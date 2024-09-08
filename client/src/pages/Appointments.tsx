import React, { useState, useEffect, useCallback } from 'react';
import { 
  Table, Button, Modal, Form, Input, DatePicker, Select, 
  message, Space, Popconfirm, Typography, Empty 
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import debounce from 'lodash/debounce';
import { useAppointmentService, Appointment } from '../api/appointmentService';
import { usePatientService, Patient } from '../api/patientService';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [editingAppointmentId, setEditingAppointmentId] = useState<number | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientPagination, setPatientPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [patientSearchValue, setPatientSearchValue] = useState('');

  const { 
    getAllAppointments, 
    createAppointment, 
    updateAppointment, 
    deleteAppointment,
    loading: appointmentLoading
  } = useAppointmentService();
  const { getPatients, loading: patientLoading } = usePatientService();

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
  }, []);

  const fetchAppointments = async () => {
    try {
      const today = moment().startOf('day').toISOString();
      const result = await getAllAppointments({ date: today });
      setAppointments(result);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      message.error('Failed to fetch appointments');
    }
  };

  const fetchPatients = useCallback(async (search = '') => {
    try {
      const res = await getPatients({
        page: 1,
        pageSize: 10,
        sortField: 'name',
        sortOrder: 'ASC',
        filters: { name: search },
      });
      
      if (Array.isArray(res)) {
        setPatients(res);
        setPatientPagination(prev => ({
          ...prev,
          total: res.length,
        }));
      } else if (res && 'patients' in res && 'totalCount' in res) {
        setPatients(res.patients);
        setPatientPagination(prev => ({
          ...prev,
          total: res.totalCount,
        }));
      } else {
        message.error('Unexpected response format');
      }
    } catch (error) {
      console.error('Failed to fetch patients:', error);
      message.error('Failed to fetch patients');
    }
  }, [getPatients]);

  const debouncedFetchPatients = useCallback(
    debounce((search: string) => fetchPatients(search), 300),
    [fetchPatients]
  );

  const handlePatientSearch = (value: string) => {
    setPatientSearchValue(value);
    debouncedFetchPatients(value);
  };

  const handleCreate = async (values: Omit<Appointment, 'id'>) => {
    try {
      await createAppointment(values);
      message.success('Appointment created successfully');
      setModalVisible(false);
      form.resetFields();
      fetchAppointments();
    } catch (error) {
      console.error('Failed to create appointment:', error);
      message.error('Failed to create appointment');
    }
  };

  const handleUpdate = async (values: Partial<Appointment>) => {
    if (editingAppointmentId === null) return;
    try {
      await updateAppointment(editingAppointmentId, values);
      message.success('Appointment updated successfully');
      setModalVisible(false);
      setEditingAppointmentId(null);
      form.resetFields();
      fetchAppointments();
    } catch (error) {
      console.error('Failed to update appointment:', error);
      message.error('Failed to update appointment');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAppointment(id);
      message.success('Appointment cancelled successfully');
      fetchAppointments();
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
      message.error('Failed to cancel appointment');
    }
  };

  const columns = [
    {
      title: 'Patient',
      dataIndex: ['patient', 'name'],
      key: 'patientName',
    },
    {
      title: 'Date & Time',
      dataIndex: 'appointmentDate',
      key: 'appointmentDate',
      render: (text: string) => moment(text).format('DD-MM-YYYY HH:mm'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Appointment) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => {
              setEditingAppointmentId(record.id);
              form.setFieldsValue({
                ...record,
                appointmentDate: moment(record.appointmentDate),
                patientId: record.patient?.id,
              });
              setModalVisible(true);
            }}
          >
            Reschedule
          </Button>
          <Popconfirm
            title="Are you sure you want to cancel this appointment?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger>Cancel</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Appointments</Title>
      <Button 
        type="primary" 
        icon={<PlusOutlined />} 
        onClick={() => {
          setEditingAppointmentId(null);
          form.resetFields();
          setModalVisible(true);
        }}
        style={{ marginBottom: '16px' }}
      >
        New Appointment
      </Button>
      <Table 
        columns={columns} 
        dataSource={appointments}
        rowKey="id"
        loading={appointmentLoading}
        locale={{
          emptyText: <Empty description="No appointments found" />
        }}
      />
      <Modal
        title={editingAppointmentId ? "Reschedule Appointment" : "New Appointment"}
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingAppointmentId(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          onFinish={editingAppointmentId ? handleUpdate : handleCreate}
          layout="vertical"
        >
          <Form.Item
            name="patientId"
            label="Patient"
            rules={[{ required: true, message: 'Please select a patient' }]}
          >
            <Select 
              placeholder="Search for a patient"
              showSearch
              filterOption={false}
              onSearch={handlePatientSearch}
              notFoundContent={patientLoading ? <span>Loading...</span> : <span>No patients found</span>}
              loading={patientLoading}
              value={patientSearchValue}
              onChange={(value) => {
                form.setFieldsValue({ patientId: value });
                setPatientSearchValue('');
              }}
            >
              {patients.map(patient => (
                <Option key={patient.id} value={patient.id}>{patient.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="appointmentDate"
            label="Appointment Date & Time"
            rules={[{ required: true, message: 'Please select appointment date and time' }]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Select placeholder="Select a status">
              <Option value="scheduled">Scheduled</Option>
              <Option value="completed">Completed</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="notes"
            label="Notes"
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingAppointmentId ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Appointments;