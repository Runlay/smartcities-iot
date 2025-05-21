import { ThemeProvider } from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import InfoAlert from '@/components/InfoAlert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const PlanExecution = () => {
  return (
    <ThemeProvider>
      <div className='container mx-auto px-6'>
        <Navbar />

        <main>
          <InfoAlert description='This page shows the latest plan (being) executed.' />

          <section>
            <h2 className='mb-4 text-2xl font-bold'>Latest Plan</h2>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <p>Plan Actions</p>
                </CardTitle>
                <CardDescription>The plan's actions</CardDescription>
              </CardHeader>
              <CardContent className='flex items-center'>
                <ul>
                  <li>Heating / AC: Turn On AC</li>
                  <li>Ventilation: Keep Off </li>
                  <li>Lighting: Turn Off Lighting</li>
                  <li>Alarm: Keep Off</li>
                </ul>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default PlanExecution;
