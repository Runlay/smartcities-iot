import PageInfo from '@/components/PageInfo';
import PageSection from '@/components/PageSection';
import PlanExecution from '@/components/PlanExecution/PlanExecution';

const PlanExecutionPage = () => {
  return (
    <>
      <PageInfo heading='Latest Plan' text='See the latest plan execution.' />

      <PageSection>
        <PlanExecution />
      </PageSection>
    </>
  );
};

export default PlanExecutionPage;
