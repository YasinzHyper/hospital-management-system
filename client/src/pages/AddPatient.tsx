import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Steps, Select, DatePicker, InputNumber, TimePicker } from 'antd';
import { useNavigate } from 'react-router-dom';
import { usePatientService } from '../api/patientService';
import moment from 'moment';

const { Step } = Steps;
const { Option } = Select;

interface AddPatientProps {
    initialValues?: Patient;
    onSubmit?: (patient: Omit<Patient, 'id' | 'uuid' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    isEditing?: boolean;
  }

  const AddPatient: React.FC<AddPatientProps> = ({ initialValues, onSubmit, isEditing = false }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const weight = Form.useWatch('weight', form);
  const height = Form.useWatch('height', form);
  const navigate = useNavigate();
  const { createPatient, loading, error } = usePatientService();
  const [formData, setFormData] = useState({});
  useEffect(() => {
    if (weight && height) {
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      form.setFieldsValue({ bmi: Number(bmi.toFixed(2)) });
    }
  }, [weight, height, form]);
  const steps = [
    {
      title: 'Personal Information',
      content: (
        <div className="grid grid-cols-2 gap-4">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
            <Select>
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
              <Option value="Third Gender">Third Gender</Option>
            </Select>
          </Form.Item>
          <Form.Item name="age" label="Age" rules={[{ required: true }]}>
            <InputNumber min={0} max={150} />
          </Form.Item>
          <Form.Item name="weight" label="Weight (kg)" rules={[{ required: true }]}>
            <InputNumber min={0} max={500} />
          </Form.Item>
          <Form.Item name="height" label="Height (cm)" rules={[{ required: true }]}>
            <InputNumber min={0} max={300} />
          </Form.Item>
          <Form.Item name="bmi" label="BMI" rules={[{ required: true }]}>
            <InputNumber disabled />
          </Form.Item>
          <Form.Item name="address" label="Address" rules={[{ required: true }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="contact1" label="Primary Contact" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="contact2" label="Secondary Contact">
            <Input />
          </Form.Item>
          <Form.Item name="panNo" label="PAN Number" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </div>
      ),
    },
    {
        title: 'Surgery Details',
        content: (
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name={['surgeryDetails', 'surgeonName']} label="Surgeon Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={['surgeryDetails', 'surgeryName']} label="Surgery Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={['surgeryDetails', 'operationDate']} label="Surgery Date" rules={[{ required: true }]}>
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item name={['surgeryDetails', 'operationTime']} label="Operation Time" rules={[{ required: true }]}>
              <TimePicker format="HH:mm" className="w-full" />
            </Form.Item>
            <Form.Item name={['surgeryDetails', 'anestheticType']} label="Anesthetic Type" rules={[{ required: true }]}>
              <Select>
                <Option value="Local">Local</Option>
                <Option value="General">General</Option>
                <Option value="Spinal">Spinal</Option>
              </Select>
            </Form.Item>
            <Form.Item name={['surgeryDetails', 'surgeryType']} label="Surgery Type" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={['surgeryDetails', 'implant']} label="Implant">
              <Input />
            </Form.Item>
          </div>
        ),
    },
    {
      title: 'Billing Information',
      content: (
        <div className="grid grid-cols-2 gap-4">
          <Form.Item name={['billingInfo', 'dateOfAdmission']} label="Date of Admission" rules={[{ required: true }]}>
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item name={['billingInfo', 'timeOfAdmission']} label="Time of Admission" rules={[{ required: true }]}>
            <TimePicker format="HH:mm" className="w-full" />
          </Form.Item>
          <Form.Item name={['billingInfo', 'numberOfDays']} label="Number of Days" rules={[{ required: true }]}>
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item name={['billingInfo', 'emergencyOrPlanned']} label="Emergency or Planned" rules={[{ required: true }]}>
            <Select>
              <Option value="Emergency">Emergency</Option>
              <Option value="Planned">Planned</Option>
            </Select>
          </Form.Item>
          <Form.Item name={['billingInfo', 'roomType']} label="Room Type" rules={[{ required: true }]}>
            <Select>
              <Option value="Deluxe">Deluxe</Option>
              <Option value="Super Deluxe">Super Deluxe</Option>
              <Option value="Suite">Suite</Option>
              <Option value="Semi Suite">Semi Suite</Option>
            </Select>
          </Form.Item>
          <Form.Item name={['billingInfo', 'roomNumber']} label="Room Number" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name={['billingInfo', 'acceptedPackage']} label="Accepted Package" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name={['billingInfo', 'paymentMode']} label="Payment Mode" rules={[{ required: true }]}>
            <Select>
              <Option value="Cashless">Cashless</Option>
              <Option value="Claim">Claim</Option>
              <Option value="Non Insurance">Non Insurance</Option>
            </Select>
          </Form.Item>
          <Form.Item name={['billingInfo', 'insuranceName']} label="Insurance Name">
            <Input />
          </Form.Item>
          <Form.Item name={['billingInfo', 'sumAssured']} label="Sum Assured">
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item name={['billingInfo', 'advancePayment']} label="Advance Payment">
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item name={['billingInfo', 'contactWithTPA']} label="Contact with TPA">
            <Select>
              <Option value={true}>Yes</Option>
              <Option value={false}>No</Option>
            </Select>
          </Form.Item>
          <Form.Item name={['billingInfo', 'totalAmount']} label="Total Amount" rules={[{ required: true }]}>
            <InputNumber min={0} />
          </Form.Item>
        </div>
      ),
    },
  ];  
  const transformInitialValues = (values: Patient | undefined) => {
    if (!values) return undefined;
    return {
      ...values,
      surgeryDetails: values.surgeryDetails ? {
        ...values.surgeryDetails,
        operationDate: values.surgeryDetails.operationDate ? moment(values.surgeryDetails.operationDate) : null,
        operationTime: values.surgeryDetails.operationTime ? moment(values.surgeryDetails.operationTime, 'HH:mm') : null,
      } : undefined,
      billingInfo: values.billingInfo ? {
        ...values.billingInfo,
        dateOfAdmission: values.billingInfo.dateOfAdmission ? moment(values.billingInfo.dateOfAdmission) : null,
        timeOfAdmission: values.billingInfo.timeOfAdmission ? moment(values.billingInfo.timeOfAdmission, 'HH:mm') : null,
      } : undefined,
    };
  };
  const next = async () => {
    try {
      const values = await form.validateFields();
      const newData = { ...formData, ...values };
      setFormData(newData);
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const onFinish = async () => {
    try {
      const values = form.getFieldsValue(true);
      const formattedValues = {
        ...values,
        bmi: Number(values.bmi),  // Ensure BMI is sent as a number
        surgeryDetails: values.surgeryDetails ? {
          ...values.surgeryDetails,
          operationDate: values.surgeryDetails.operationDate?.format('YYYY-MM-DD'),
          operationTime: values.surgeryDetails.operationTime?.format('HH:mm'),
        } : undefined,
        billingInfo: values.billingInfo ? {
          ...values.billingInfo,
          dateOfAdmission: values.billingInfo.dateOfAdmission?.format('YYYY-MM-DD'),
          timeOfAdmission: values.billingInfo.timeOfAdmission?.format('HH:mm'),
        } : undefined,
        admissionDate: values.billingInfo?.dateOfAdmission?.format('YYYY-MM-DD'),
        admissionTime: values.billingInfo?.timeOfAdmission?.format('HH:mm'),
        surgeryDate: values.surgeryDetails?.operationDate?.format('YYYY-MM-DD'),
      };

      if (isEditing && onSubmit) {
        await onSubmit(formattedValues);
      } else {
        await createPatient(formattedValues);
        message.success('Patient added successfully');
        navigate('/patients');
      }
    } catch (err) {
      console.error('Error adding/updating patient:', err);
      message.error('Failed to add/update patient');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Add New Patient</h1>
      <Steps current={currentStep} className="mb-8">
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">{steps[currentStep].title}</h2>
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={transformInitialValues(initialValues)}
            >
            {steps[currentStep].content}
          <div className="flex justify-between mt-8">
            {currentStep > 0 && (
              <Button onClick={() => prev()}>
                Previous
              </Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                Next
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                {isEditing ? 'Update Patient' : 'Add Patient'}
              </Button>
            </Form.Item>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddPatient;