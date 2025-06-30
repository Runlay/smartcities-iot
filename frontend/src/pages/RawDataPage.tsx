import PageInfo from '@/components/PageInfo';
import SensorDataTable from '@/components/RawData/SensorDataTable';
import PageSection from '@/components/PageSection';

const RawDataPage = () => {
  return (
    <>
      <PageInfo
        heading='Raw Sensor Data'
        text='View raw sensor data in JSON format.'
      />

      <PageSection>
        <SensorDataTable />
      </PageSection>
    </>
  );
};

export default RawDataPage;
