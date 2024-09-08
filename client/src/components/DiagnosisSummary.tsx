import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Table, Typography, Input, DatePicker, Button, message, Space, List, Modal, Popconfirm, AutoComplete } from 'antd';
import { AudioOutlined, AudioMutedOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useDiagnosisService, Diagnosis } from '../api/diagnosisService';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const { Text } = Typography;

interface DiagnosisSummaryProps {
  patientId: number;
}

interface MedicationItem {
    name: string;
    dosage: string;
    duration: string;
  }

const medicationNames = [
    'Ibuprofen', 'Naproxen', 'Celecoxib', 'Meloxicam',
    'Acetaminophen', 'Tramadol', 'Oxycodone', 'Hydrocodone',
    'Prednisone', 'Methylprednisolone', 'Cortisone',
    'Alendronate', 'Risedronate', 'Zoledronic acid',
    'Calcium', 'Vitamin D', 'Glucosamine', 'Chondroitin'
  ];
  
  const dosages = [
    '500 mg', '1000 mg', '10 mg', '20 mg', '40 mg', '50 mg', '100 mg'
  ];
  
  const frequencies = [
    'Once daily', 'Twice daily', 'Three times daily', 'Four times daily',
    'Every 4 hours', 'Every 6 hours', 'Every 8 hours', 'As needed'
  ];

const matchKeywords = (input: string) => {
  const words = input.toLowerCase().split(' ');
  return words.filter(word => medicationNames.includes(word));
};

const DiagnosisSummary: React.FC<DiagnosisSummaryProps> = ({ patientId }) => {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [filters, setFilters] = useState({ keyword: '', startDate: '', endDate: '' });
  const [newDiagnosis, setNewDiagnosis] = useState({ summary: '', medications: [] as MedicationItem[] });
  const [isListening, setIsListening] = useState(false);
  const [recognitionInstance, setRecognitionInstance] = useState<SpeechRecognition | null>(null);
  const [recognizedText, setRecognizedText] = useState('');
  const [editingMedicationIndex, setEditingMedicationIndex] = useState<number | null>(null);
  const [medicationModalVisible, setMedicationModalVisible] = useState(false);

  const [currentMedication, setCurrentMedication] = useState<MedicationItem>({ name: '', dosage: '', frequency: '' });

  const filterOptions = (inputValue: string, option: { value: string }) => {
    return option.value.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1;
  };

  const nameOptions = useMemo(() => medicationNames.map(name => ({ value: name })), []);
  const dosageOptions = useMemo(() => dosages.map(dosage => ({ value: dosage })), []);
  const frequencyOptions = useMemo(() => frequencies.map(frequency => ({ value: frequency })), []);

  const { getDiagnoses, addDiagnosis, loading, error } = useDiagnosisService();

  useEffect(() => {
    fetchDiagnoses();
  }, [patientId, pagination.current, pagination.pageSize, filters]);

  const fetchDiagnoses = useCallback(() => {
    getDiagnoses(patientId, {
      page: pagination.current,
      pageSize: pagination.pageSize,
      keyword: filters.keyword,
      startDate: filters.startDate,
      endDate: filters.endDate,
    }).then((result) => {
      setDiagnoses(result.diagnoses);
      setPagination(prev => ({ 
        ...prev, 
        current: result.page, 
        pageSize: result.pageSize, 
        total: result.totalCount 
      }));
    }).catch((err) => {
      console.error('Failed to fetch diagnoses:', err);
      message.error('Failed to fetch diagnoses');
    });
  }, [patientId, pagination.current, pagination.pageSize, filters, getDiagnoses]);

  const handleTableChange = (newPagination: any) => {
    setPagination(newPagination);
  };

  const handleFilterChange = (value: any, type: string) => {
    setFilters(prev => ({ ...prev, [type]: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleAddDiagnosis = () => {
    const formattedMedications = newDiagnosis.medications.map(med => 
      `${med.name} ${med.dosage} ${med.frequency}`
    ).join(', ');

    addDiagnosis({ 
      summary: newDiagnosis.summary, 
      medications: formattedMedications, 
      patient_id: patientId 
    })
      .then(() => {
        message.success('Diagnosis added successfully');
        setNewDiagnosis({ summary: '', medications: [] });
        fetchDiagnoses();
      })
      .catch((err) => {
        console.error('Failed to add diagnosis:', err);
        message.error('Failed to add diagnosis');
      });
  };
  useEffect(() => {
    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, [recognitionInstance]);

  const handleVoiceInput = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setNewDiagnosis(prev => ({
          ...prev,
          summary: prev.summary + ' ' + transcript
        }));
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognitionInstance(recognition);
      recognition.start();
      setIsListening(true);
    } else {
      message.error('Speech recognition is not supported in this browser.');
    }
  }, []);

  const stopVoiceInput = useCallback(() => {
    if (recognitionInstance) {
      recognitionInstance.stop();
    }
    setIsListening(false);
  }, [recognitionInstance]);

  const openMedicationModal = (index: number | null = null) => {
    if (index !== null) {
      setCurrentMedication(newDiagnosis.medications[index]);
      setEditingMedicationIndex(index);
    } else {
      setCurrentMedication({ name: '', dosage: '', frequency: '' });
      setEditingMedicationIndex(null);
    }
    setMedicationModalVisible(true);
  };

  const handleMedicationModalOk = () => {
    if (editingMedicationIndex !== null) {
      setNewDiagnosis(prev => ({
        ...prev,
        medications: prev.medications.map((med, index) => 
          index === editingMedicationIndex ? currentMedication : med
        )
      }));
    } else {
      setNewDiagnosis(prev => ({
        ...prev,
        medications: [...prev.medications, currentMedication]
      }));
    }
    setMedicationModalVisible(false);
  };

  const deleteMedication = (index: number) => {
    setNewDiagnosis(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  const renderMedication = (medication: MedicationItem, index: number) => (
    <div key={index}>
      <Text strong>{`${index + 1}) ${medication.name}`}</Text>
      <br />
      <Text>{medication.dosage}</Text>
      <br />
      <Text type="secondary">{medication.duration}</Text>
    </div>
  );

  const columns = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => moment(text).format('DD-MMM-YYYY HH:mm'),
    },
    {
      title: 'Summary',
      dataIndex: 'summary',
      key: 'summary',
    },
    {
      title: 'Medications',
      dataIndex: 'medications',
      key: 'medications',
      width: '30%',
      render: (medications: string) => {
        const medicationList = medications.split(', ').map((med, index) => {
          const [name, dosage, duration] = med.split(' - ');
          return renderMedication({ name, dosage, duration }, index);
        });
        return <div style={{ maxHeight: '200px', overflowY: 'auto' }}>{medicationList}</div>;
      },
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <Input
          placeholder="Search keyword"
          value={filters.keyword}
          onChange={(e) => handleFilterChange(e.target.value, 'keyword')}
          style={{ width: 200, marginRight: 16 }}
        />
        <RangePicker
          onChange={(dates) => {
            handleFilterChange(dates?.[0]?.toISOString() || '', 'startDate');
            handleFilterChange(dates?.[1]?.toISOString() || '', 'endDate');
          }}
          style={{ marginRight: 16 }}
        />
      </div>
      
      <Table
        columns={columns}
        dataSource={diagnoses}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />

      <div className="mt-8">
        <h3>Add New Diagnosis</h3>
        <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <TextArea
            rows={4}
            placeholder="Enter diagnosis summary"
            value={newDiagnosis.summary}
            onChange={(e) => setNewDiagnosis(prev => ({ ...prev, summary: e.target.value }))}
            className="mb-2"
          />
          <Button 
            icon={isListening ? <AudioMutedOutlined /> : <AudioOutlined />}
            onClick={isListening ? stopVoiceInput : handleVoiceInput}
          >
            {isListening ? 'Stop Voice Input' : 'Start Voice Input'}
          </Button>
        </div>
          <div>
            <Button icon={<PlusOutlined />} onClick={() => openMedicationModal()}>
              Add Medication
            </Button>
          </div>
          <List
            bordered
            dataSource={newDiagnosis.medications}
            renderItem={(item, index) => (
            <List.Item
                actions={[
                <Button key={index} icon={<EditOutlined />} onClick={() => openMedicationModal(index)} />,
                <Popconfirm
                key={index}
                    title="Are you sure you want to delete this medication?"
                    onConfirm={() => deleteMedication(index)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button icon={<DeleteOutlined />} />
                </Popconfirm>
                ]}
            >
                {renderMedication(item, index)}
            </List.Item>
            )}
        />
          <Button type="primary" onClick={handleAddDiagnosis}>
            Add Diagnosis
          </Button>
        </Space>
      </div>

            <Modal
        title={editingMedicationIndex !== null ? "Edit Medication" : "Add Medication"}
        visible={medicationModalVisible}
        onOk={handleMedicationModalOk}
        onCancel={() => setMedicationModalVisible(false)}
      >
        <AutoComplete
          options={nameOptions}
          style={{ width: '100%' }}
          onSelect={(value) => setCurrentMedication(prev => ({ ...prev, name: value }))}
          onChange={(value) => setCurrentMedication(prev => ({ ...prev, name: value }))}
          placeholder="Medication Name"
          value={currentMedication.name}
          filterOption={filterOptions}
        />
        <AutoComplete
          options={dosageOptions}
          style={{ width: '100%', marginTop: '10px' }}
          onSelect={(value) => setCurrentMedication(prev => ({ ...prev, dosage: value }))}
          onChange={(value) => setCurrentMedication(prev => ({ ...prev, dosage: value }))}
          placeholder="Dosage"
          value={currentMedication.dosage}
          filterOption={filterOptions}
        />
        <AutoComplete
          options={frequencyOptions}
          style={{ width: '100%', marginTop: '10px' }}
          onSelect={(value) => setCurrentMedication(prev => ({ ...prev, frequency: value }))}
          onChange={(value) => setCurrentMedication(prev => ({ ...prev, frequency: value }))}
          placeholder="Frequency"
          value={currentMedication.frequency}
          filterOption={filterOptions}
        />
      </Modal>
    </div>
  );
};

export default DiagnosisSummary;