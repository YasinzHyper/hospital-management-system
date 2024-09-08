import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, Descriptions, Button, message, Spin, Card, Tag, Row, Col, Modal } from 'antd';
import { EditOutlined,FileTextOutlined,  DeleteOutlined, UserOutlined, MedicineBoxOutlined, DollarOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { usePatientService, Patient } from '../api/patientService';
import DiagnosisSummary from '../components/DiagnosisSummary';


import moment from 'moment';

const { TabPane } = Tabs;
const { confirm } = Modal;

const PatientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPatient, deletePatient, loading, error } = usePatientService();
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (id) {
      fetchPatient(id);
    }
  }, [id]);

  const fetchPatient = async (patientId: string) => {
    try {
      const data = await getPatient(patientId);
      if (data && !Array.isArray(data)) {
        setPatient(data);
      } else {
        message.error('Failed to fetch patient details');
      }
    } catch (err) {
      console.error('Error fetching patient:', err);
      message.error('Failed to fetch patient details');
    }
  };

  const showDeleteConfirm = () => {
    confirm({
      title: 'Are you sure you want to delete this patient?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDelete();
      },
    });
  };

  const handleDelete = async () => {
    if (id) {
      try {
        await deletePatient(id);
        message.success('Patient deleted successfully');
        navigate('/patients');
      } catch (err) {
        console.error('Error deleting patient:', err);
        message.error('Failed to delete patient');
      }
    }
  };

  if (loading) {
    return <Spin size="large" className="flex justify-center items-center h-screen" />;
  }

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  if (!patient) {
    return <div className="text-center">Patient not found</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card className="mb-6 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{patient.name}</h1>
          <div>
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              onClick={() => navigate(`/patients/edit/${id}`)}
              className="mr-2"
            >
              Edit
            </Button>
            <Button 
              danger 
              icon={<DeleteOutlined />} 
              onClick={showDeleteConfirm}
            >
              Delete
            </Button>
          </div>
        </div>
        <Descriptions bordered>
          <Descriptions.Item label="Patient ID">{patient.id}</Descriptions.Item>
          <Descriptions.Item label="Gender">{patient.gender}</Descriptions.Item>
          <Descriptions.Item label="Age">{patient.age}</Descriptions.Item>
          <Descriptions.Item label="Contact">{patient.contact1}</Descriptions.Item>
          <Descriptions.Item label="PAN Number">{patient.panNo}</Descriptions.Item>
        </Descriptions>
      </Card>
      
      <Tabs defaultActiveKey="1" className="bg-white p-6 shadow-md rounded-lg">
        <TabPane 
          tab={<span><UserOutlined className='mr-3' />Personal Information</span>} 
          key="1"
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card title="Basic Info" className="h-full">
                <Descriptions column={1}>
                  <Descriptions.Item label="Weight">{patient.weight} kg</Descriptions.Item>
                  <Descriptions.Item label="Height">{patient.height} cm</Descriptions.Item>
                  <Descriptions.Item label="BMI">{patient.bmi}</Descriptions.Item>
                  <Descriptions.Item label="Address">{patient.address}</Descriptions.Item>
                  <Descriptions.Item label="Secondary Contact">{patient.contact2}</Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Additional Info" className="h-full">
                <Descriptions column={1}>
                  <Descriptions.Item label="Admission Date">
                    {moment(patient.admissionDate).format('DD-MMM-YYYY')}
                  </Descriptions.Item>
                  <Descriptions.Item label="Admission Time">{patient.admissionTime}</Descriptions.Item>
                  <Descriptions.Item label="Created At">
                    {moment(patient.createdAt).format('DD-MMM-YYYY HH:mm')}
                  </Descriptions.Item>
                  <Descriptions.Item label="Last Updated">
                    {moment(patient.updatedAt).format('DD-MMM-YYYY HH:mm')}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          </Row>
        </TabPane>
        
        <TabPane 
          tab={<span><MedicineBoxOutlined className='mr-3' />Surgery Details</span>} 
          key="2"
        >
          <Card>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Surgeon Name">{patient.surgeryDetails.surgeonName}</Descriptions.Item>
              <Descriptions.Item label="Surgery Name">{patient.surgeryDetails.surgeryName}</Descriptions.Item>
              <Descriptions.Item label="Operation Date">
                {moment(patient.surgeryDetails.operationDate).format('YYYY-MM-DD')}
              </Descriptions.Item>
              <Descriptions.Item label="Operation Time">{patient.surgeryDetails.operationTime}</Descriptions.Item>
              <Descriptions.Item label="Anesthetic Type">{patient.surgeryDetails.anestheticType}</Descriptions.Item>
              <Descriptions.Item label="Surgery Type">{patient.surgeryDetails.surgeryType}</Descriptions.Item>
              <Descriptions.Item label="Implant">{patient.surgeryDetails.implant}</Descriptions.Item>
            </Descriptions>
          </Card>
        </TabPane>
        
        <TabPane 
          tab={<span><DollarOutlined className='mr-3' />Billing Information</span>} 
          key="3"
        >
          <Card>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Date of Admission">
                {moment(patient.billingInfo.dateOfAdmission).format('YYYY-MM-DD')}
              </Descriptions.Item>
              <Descriptions.Item label="Time of Admission">{patient.billingInfo.timeOfAdmission}</Descriptions.Item>
              <Descriptions.Item label="Number of Days">{patient.billingInfo.numberOfDays}</Descriptions.Item>
              <Descriptions.Item label="Emergency/Planned">
                <Tag color={patient.billingInfo.emergencyOrPlanned === 'Emergency' ? 'red' : 'green'}>
                  {patient.billingInfo.emergencyOrPlanned}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Room Type">{patient.billingInfo.roomType}</Descriptions.Item>
              <Descriptions.Item label="Room Number">{patient.billingInfo.roomNumber}</Descriptions.Item>
              <Descriptions.Item label="Accepted Package">{patient.billingInfo.acceptedPackage}</Descriptions.Item>
              <Descriptions.Item label="Payment Mode">{patient.billingInfo.paymentMode}</Descriptions.Item>
              <Descriptions.Item label="Insurance Name">{patient.billingInfo.insuranceName}</Descriptions.Item>
              <Descriptions.Item label="Sum Assured">{patient.billingInfo.sumAssured}</Descriptions.Item>
              <Descriptions.Item label="Advance Payment">{patient.billingInfo.advancePayment}</Descriptions.Item>
              <Descriptions.Item label="Contact with TPA">
                {patient.billingInfo.contactWithTPA ? 'Yes' : 'No'}
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount">
                <span className="text-lg font-bold">{patient.billingInfo.totalAmount}</span>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </TabPane>
        <TabPane 
            tab={<span><FileTextOutlined className='mr-3' />Diagnosis Summary</span>} 
            key="4"
            >
            <DiagnosisSummary patientId={Number(id)} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default PatientDetails;