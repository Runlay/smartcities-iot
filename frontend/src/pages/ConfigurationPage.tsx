import ChangeSettings from '@/components/Configuration/ChangeSettings';
import CurrentConfiguration from '@/components/Configuration/CurrentConfiguration';
import PageInfo from '@/components/PageInfo';
import PageSection from '@/components/PageSection';

const ConfigurationPage = () => {
  return (
    <>
      <PageInfo
        heading='Configuration'
        text='Manage your system configuration and settings.'
      />

      <PageSection>
        <CurrentConfiguration />
      </PageSection>

      <PageSection>
        <ChangeSettings />
      </PageSection>
    </>
  );
};

export default ConfigurationPage;
